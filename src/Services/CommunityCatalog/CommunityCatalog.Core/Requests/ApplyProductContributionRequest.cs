using MediatR;

namespace CommunityCatalog.Core.Requests
{
    public record ApplyProductContributionRequest(string ContributionId, string? StatusDescription) : IRequest;
}
