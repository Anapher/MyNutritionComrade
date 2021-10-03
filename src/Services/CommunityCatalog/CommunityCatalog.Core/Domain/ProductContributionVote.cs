using System;

namespace CommunityCatalog.Core.Domain
{
    public record ProductContributionVote(string UserId, string ProductContributionId, bool Approve,
        DateTimeOffset CreatedOn);
}
