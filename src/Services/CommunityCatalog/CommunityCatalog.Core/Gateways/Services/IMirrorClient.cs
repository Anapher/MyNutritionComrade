using System.Collections.Generic;
using System.Threading.Tasks;
using MyNutritionComrade.Models;
using MyNutritionComrade.Models.Index;

namespace CommunityCatalog.Core.Gateways.Services
{
    public interface IMirrorClient
    {
        Task<IReadOnlyList<ProductCatalogReference>> FetchCatalogsFromIndex(string indexUrl);

        Task<IReadOnlyList<Product>> FetchProductsFromCatalog(string catalogUrl);
    }
}
