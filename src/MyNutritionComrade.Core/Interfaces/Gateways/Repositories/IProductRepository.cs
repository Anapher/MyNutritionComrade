using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<Product?> GetFullProductById(int productId);
    }
}
