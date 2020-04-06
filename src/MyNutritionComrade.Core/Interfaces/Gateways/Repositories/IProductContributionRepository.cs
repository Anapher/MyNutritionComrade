using System.Collections.Generic;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IProductContributionRepository
    {
        Task<ProductContribution?> FindById(string productContributionId);
        Task<bool> Add(ProductContribution productContribution);
        Task<ProductContribution?> FindByPatchHash(string productId, string patchHash);
        Task<List<ProductContribution>> GetActiveProductContributions(string productId);
        Task<bool> UpdateProductContribution(ProductContribution contribution);
    }
}
