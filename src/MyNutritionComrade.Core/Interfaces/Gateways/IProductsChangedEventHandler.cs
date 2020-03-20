using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Gateways
{
    public interface IProductsChangedEventHandler
    {
        ValueTask AddProduct(Product product);
        ValueTask UpdateProduct(Product product);
        ValueTask RemoveProduct(Product product);
    }
}
