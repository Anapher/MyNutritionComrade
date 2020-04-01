using System.Collections.Generic;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IProductRepository
    {
        Task<Product?> FindById(string productId);
        Task<Product?> FindByBarcode(string code);
        Task Add(Product product);
        Task Update(Product product);
        Task Delete(string productId);
        Task<List<Product>> BulkFindProductsByIds(IEnumerable<string> ids);
    }
}
