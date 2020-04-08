#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

using System;
using System.Collections.Generic;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Models.Response
{
    public class ProductContributionDto
    {
        public string Id { get; set; }
        public ProductContributionStatus Status { get; set; }
        public string? StatusDescription { get; set; }
        public string ProductId { get; set; }
        public List<PatchOperation> Patch { get; set; }
        public DateTimeOffset CreatedOn { get; set; }

        public bool IsContributionFromUser { get; set; }

        public ProductContributionStatistics Statistics { get; set; }
        public UserVoteDto? Vote { get; set; }
    }

    public class ProductContributionStatistics
    {
        public int TotalVotes { get; set; }
        public int ApproveVotes { get; set; }
    }

    public class UserVoteDto
    {
        public bool Approve { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
    }
}
