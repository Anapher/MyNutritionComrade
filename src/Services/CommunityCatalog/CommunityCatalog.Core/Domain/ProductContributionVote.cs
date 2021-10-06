using System;

namespace CommunityCatalog.Core.Domain
{
    public record ProductContributionVote(string UserId, string ProductContributionId, string ProductId, bool Approve,
        DateTimeOffset CreatedOn);
}
