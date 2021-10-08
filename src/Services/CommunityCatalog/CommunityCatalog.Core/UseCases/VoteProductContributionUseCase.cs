using System;
using System.Threading;
using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Extensions;
using CommunityCatalog.Core.Gateways.Repos;
using CommunityCatalog.Core.Requests;
using MediatR;

namespace CommunityCatalog.Core.UseCases
{
    public class
        VoteProductContributionUseCase : IRequestHandler<VoteProductContributionRequest, ProductContributionStatus>
    {
        private readonly IProductContributionRepository _repository;
        private readonly IProductContributionVoteRepository _voteRepository;
        private readonly IMediator _mediator;

        public VoteProductContributionUseCase(IProductContributionRepository repository,
            IProductContributionVoteRepository voteRepository, IMediator mediator)
        {
            _repository = repository;
            _voteRepository = voteRepository;
            _mediator = mediator;
        }

        public async Task<ProductContributionStatus> Handle(VoteProductContributionRequest request,
            CancellationToken cancellationToken)
        {
            var (userId, contributionId, approve) = request;

            var productContribution = await _repository.FindById(contributionId);
            if (productContribution == null)
                throw ProductContributionError.NotFound(contributionId).ToException();

            if (productContribution.UserId == userId)
                throw ProductContributionError.CreatorCannotVote().ToException();

            await CreateVote(userId, contributionId, productContribution.ProductId, approve);

            try
            {
                await OptimisticConcurrencyChecks(contributionId);
            }
            catch
            {
                await _voteRepository.RemoveVote(contributionId, userId);
                throw;
            }

            return await _mediator.Send(new CheckProductContributionVotesRequest(contributionId), cancellationToken);
        }

        private async Task CreateVote(string userId, string contributionId, string productId, bool approve)
        {
            var vote = new ProductContributionVote(userId, contributionId, productId, approve, DateTimeOffset.UtcNow);
            try
            {
                await _voteRepository.Add(vote);
            }
            catch
            {
                var existingVote = await _voteRepository.FindVote(contributionId, userId);
                if (existingVote != null)
                    throw ProductContributionError.AlreadyVoted().ToException();

                throw;
            }
        }

        private async Task OptimisticConcurrencyChecks(string contributionId)
        {
            var productContribution = await _repository.FindById(contributionId);
            if (productContribution == null)
                throw ProductContributionError.NotFound(contributionId).ToException();

            if (productContribution.Status != ProductContributionStatus.Pending)
                throw ProductContributionError.InvalidStatus().ToException();
        }
    }
}
