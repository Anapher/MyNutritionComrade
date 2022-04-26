using System.Threading.Tasks;
using MyNutritionComrade.Models;

namespace Extractor.Interface
{
    public interface IProductWriter
    {
        ValueTask Write(Product product);
    }
}
