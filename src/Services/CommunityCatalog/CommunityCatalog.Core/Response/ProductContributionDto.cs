using System;
using System.Collections.Generic;
using CommunityCatalog.Core.Domain;
using Microsoft.AspNetCore.JsonPatch.Operations;

namespace CommunityCatalog.Core.Response
{
    public record ProductContributionDto(string Id, string ProductId, ProductContributionStatus Status,
        string? StatusDescription, IReadOnlyList<Operation> Operations, DateTimeOffset CreatedOn, bool CreatedByYou,
        ProductContributionStatisticsDto Statistics, YourVoteDto? YourVote);

    public record ProductContributionStatisticsDto(int TotalVotes, int ApproveVotes);

    public record YourVoteDto(bool Approve, DateTimeOffset CreatedOn);
}
