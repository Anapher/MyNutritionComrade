
using System.Threading.Tasks;
using MyNutritionComrade.Core.Dto;

namespace MyNutritionComrade.Core.Interfaces.Services
{
    public interface IJwtFactory
    {
        Task<string> GenerateEncodedToken(string id, string userName);
    }
}