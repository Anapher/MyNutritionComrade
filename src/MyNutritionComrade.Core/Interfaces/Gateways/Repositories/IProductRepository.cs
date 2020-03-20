using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IProductRepository
    {
        Task<Product?> FindById(string productId);
        Task Add(Product product);
        Task Update(Product product);
    }
}
