
using System.Threading.Tasks;

namespace MyNutritionComrade.Core.Interfaces.Services
{
    public interface IJwtFactory
    {
        Task<string> GenerateEncodedToken(string id);
    }
}