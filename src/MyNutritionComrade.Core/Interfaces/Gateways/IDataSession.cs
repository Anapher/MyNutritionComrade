using System.Threading.Tasks;

namespace MyNutritionComrade.Core.Interfaces.Gateways
{
    public interface IDataSession
    {
        ValueTask SaveChangesAsync();
    }
}
