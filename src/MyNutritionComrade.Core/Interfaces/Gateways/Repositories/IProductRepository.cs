using System.Collections.Generic;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IProductRepository
    {
        Task<Product?> FindById(string productId);
        Task<ICollection<Product>> FindByIds(IEnumerable<string> ids);

        Task<Product?> FindByBarcode(string code);
        Task<bool> Add(Product product, ProductContribution initialContribution);
        Task<bool> SaveProductChanges(Product product, int sourceVersion, ProductContribution productContribution);
    }
}
