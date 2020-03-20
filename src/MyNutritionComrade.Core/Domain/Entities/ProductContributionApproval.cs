using System;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductContributionApproval
    {
        public int UserId { get; set; }
        public bool Approve { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
    }
}
