using System;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductContributionVote
    {
        public ProductContributionVote(string userId, string productContributionId, bool approve)
        {
            UserId = userId;
            ProductContributionId = productContributionId;
            Approve = approve;
        }

        public string UserId { get; private set; }
        public string ProductContributionId { get; private set; }

        public bool Approve { get; private set; }
        public DateTimeOffset CreatedOn { get; private set; } = DateTimeOffset.UtcNow;
    }
}
