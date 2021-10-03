using System.Threading;
using System.Threading.Tasks;
using CommunityCatalog.Core.Gateways.Repos;
using CommunityCatalog.Core.Options;
using CommunityCatalog.Core.Requests;
using MediatR;
using Microsoft.Extensions.Options;

namespace CommunityCatalog.Core.UseCases
{
    public class CheckProductContributionVotesUseCase : IRequestHandler<CheckProductContributionVotesRequest>
    {
        private readonly IProductContributionVoteRepository _repository;
        private readonly VotingOptions _options;

        public CheckProductContributionVotesUseCase(IProductContributionVoteRepository repository, IOptions<VotingOptions> options)
        {
            _repository = repository;
            _options = options.Value;
        }

        public async Task<Unit> Handle(CheckProductContributionVotesRequest request,
            CancellationToken cancellationToken)
        {
            var voting = await _repository.GetVoting(request.ContributionId);

            var totalVotes = voting.ApproveVotes + voting.DisapproveVotes;
            var proportion = voting.ApproveVotes / (double)totalVotes;

            if (totalVotes < _options.MinVotesRequired)
                return Unit.Value;

            if (1 - proportion < _options.EffectProportionMargin)
                await AcceptContribution();
            else if (proportion < _options.EffectProportionMargin)
                await RejectContribution();

            return Unit.Value;
        }

        private async Task AcceptContribution()
        {

        }

        private async Task RejectContribution()
        {

        }
    }
}
