using System.Security.Claims;

namespace MyNutritionComrade.Core.Interfaces.Services
{
    public interface IJwtValidator
    {
        ClaimsPrincipal? GetPrincipalFromToken(string token);
    }
}