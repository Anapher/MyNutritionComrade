#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

namespace MyNutritionComrade.Core.Dto.GatewayResponses.Repositories
{
    public class ProductContributionVoting
    {
        public string ProductContributionId { get; set; }
        public int ApproveVotes { get; set; }
        public int DisapproveVotes { get; set; }
    }
}
