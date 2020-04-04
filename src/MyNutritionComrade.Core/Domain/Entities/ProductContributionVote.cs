using System;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductContributionVote
    {
        public string UserId { get; set; } = string.Empty;
        public string ProductContributionId { get; set; } = string.Empty;
        public bool Approve { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
    }
}
