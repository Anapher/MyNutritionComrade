using System.Threading;
using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Gateways.Repos;
using CommunityCatalog.Core.Options;
using CommunityCatalog.Core.Requests;
using MediatR;
using Microsoft.Extensions.Options;

namespace CommunityCatalog.Core.UseCases
{
    public class
        CheckProductContributionVotesUseCase : IRequestHandler<CheckProductContributionVotesRequest,
            ProductContributionStatus>
    {
        private readonly IProductContributionVoteRepository _repository;
        private readonly IMediator _mediator;
        private readonly VotingOptions _options;

        public CheckProductContributionVotesUseCase(IProductContributionVoteRepository repository, IMediator mediator,
            IOptions<VotingOptions> options)
        {
            _repository = repository;
            _mediator = mediator;
            _options = options.Value;
        }

        public async Task<ProductContributionStatus> Handle(CheckProductContributionVotesRequest request,
            CancellationToken cancellationToken)
        {
            var voting = await _repository.GetVoting(request.ContributionId);

            var totalVotes = voting.ApproveVotes + voting.DisapproveVotes;

            if (totalVotes >= _options.MinVotesRequired)
            {
                var proportion = voting.ApproveVotes / (double)totalVotes;

                if (1 - proportion < _options.EffectProportionMargin)
                {
                    await _mediator.Send(new ApplyProductContributionRequest(request.ContributionId,
                        $"Automatically applied (votes: {totalVotes}, approval rate: {proportion})"));
                    return ProductContributionStatus.Applied;
                }

                if (proportion < _options.EffectProportionMargin)
                {
                    await _mediator.Send(new RejectProductContributionRequest(request.ContributionId,
                        $"Automatically rejected (votes: {totalVotes}, approval rate: {proportion})"));
                    return ProductContributionStatus.Rejected;
                }
            }

            return ProductContributionStatus.Pending;
        }
    }
}
