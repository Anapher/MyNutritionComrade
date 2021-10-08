using System.Threading;
using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Extensions;
using CommunityCatalog.Core.Gateways.Repos;
using CommunityCatalog.Core.Requests;
using MediatR;

namespace CommunityCatalog.Core.UseCases
{
    public class RejectProductContributionUseCase : IRequestHandler<RejectProductContributionRequest>
    {
        private readonly IProductContributionRepository _contributionRepository;

        public RejectProductContributionUseCase(IProductContributionRepository contributionRepository)
        {
            _contributionRepository = contributionRepository;
        }

        public async Task<Unit> Handle(RejectProductContributionRequest request, CancellationToken cancellationToken)
        {
            var contribution = await _contributionRepository.FindById(request.ContributionId);
            if (contribution == null)
                throw ProductContributionError.NotFound(request.ContributionId).ToException();

            if (contribution.Status != ProductContributionStatus.Pending)
                throw ProductContributionError.InvalidStatus().ToException();

            var updated = contribution.Reject(request.StatusDescription);
            await _contributionRepository.ReplacePendingContribution(updated);

            return Unit.Value;
        }
    }
}
