using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IProductContributionsRepository
    {
        Task Add(ProductContribution productContribution);
        Task Apply(ProductContribution productContribution);
    }
}
