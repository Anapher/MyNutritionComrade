using MyNutritionComrade.Core.Shared;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductContributionApproval : BaseEntity
    {
        public int ProductContributionId { get; set; }
        public int UserId { get; set; }
        public bool Approve { get; set; }
    }
}