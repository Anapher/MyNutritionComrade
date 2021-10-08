using CommunityCatalog.Core.Domain;
using MediatR;

namespace CommunityCatalog.Core.Requests
{
    public record VoteProductContributionRequest
        (string UserId, string ContributionId, bool Vote) : IRequest<ProductContributionStatus>;
}
