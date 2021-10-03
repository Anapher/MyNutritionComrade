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
    public class VoteProductContributionUseCase : IRequestHandler<VoteProductContributionRequest>
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

        public async Task<Unit> Handle(VoteProductContributionRequest request, CancellationToken cancellationToken)
        {
            var (userId, contributionId, approve) = request;

            var productContribution = await _repository.FindById(contributionId);
            if (productContribution == null)
                throw ProductError.ProductContributionNotFound(contributionId).ToException();

            if (productContribution.UserId == userId)
                throw ProductError.ProductContributionCreatorCannotVote().ToException();

            await CreateVote(userId, contributionId, approve);

            try
            {
                await OptimisticConcurrencyChecks(contributionId);
            }
            catch
            {
                await _voteRepository.RemoveVote(contributionId, userId);
                throw;
            }

            await _mediator.Send(new CheckProductContributionVotesRequest(contributionId), cancellationToken);

            return Unit.Value;
        }

        private async Task CreateVote(string userId, string contributionId, bool approve)
        {
            var vote = new ProductContributionVote(userId, string.Empty, approve, DateTimeOffset.UtcNow);
            try
            {
                await _voteRepository.Add(vote);
            }
            catch
            {
                var existingVote = await _voteRepository.FindVote(contributionId, userId);
                if (existingVote != null)
                    throw ProductError.ProductContributionAlreadyVoted().ToException();

                throw;
            }
        }

        private async Task OptimisticConcurrencyChecks(string contributionId)
        {
            var productContribution = await _repository.FindById(contributionId);
            if (productContribution == null)
                throw ProductError.ProductContributionNotFound(contributionId).ToException();

            if (productContribution.Status != ProductContributionStatus.Pending)
                throw ProductError.ProductContributionInvalidStatus().ToException();
        }
    }
}
