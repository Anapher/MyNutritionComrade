using System.Collections.Generic;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Interfaces.Services;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IProductRepository
    {
        Task<IList<IProduct>> QueryProducts(string searchString, int limit);
        Task<IProduct> GetProductByCode(string productCode);
    }
}
