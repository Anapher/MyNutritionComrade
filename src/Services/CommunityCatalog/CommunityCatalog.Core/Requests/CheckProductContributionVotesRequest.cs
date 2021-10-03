using MediatR;

namespace CommunityCatalog.Core.Requests
{
    public record CheckProductContributionVotesRequest(string ContributionId) : IRequest;
}
