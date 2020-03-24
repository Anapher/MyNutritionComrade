using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IProductContributionsRepository
    {
        Task Add(ProductContribution productContribution);
        Task<Error?> Apply(ProductContribution productContribution);
    }
}
