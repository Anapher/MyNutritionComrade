using MediatR;

namespace CommunityCatalog.Core.Requests
{
    public record RejectProductContributionRequest(string ContributionId, string? StatusDescription) : IRequest;
}
