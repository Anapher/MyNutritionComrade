using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.GatewayResponses.Repositories;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IProductContributionVoteRepository
    {
        Task<bool> AddVote(ProductContributionVote vote);
        Task RemoveVote(ProductContributionVote vote);
        Task<ProductContributionVoting?> GetVoting(string productContributionId);
    }
}
