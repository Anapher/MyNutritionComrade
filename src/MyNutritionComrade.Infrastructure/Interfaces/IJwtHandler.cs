using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MyNutritionComrade.Infrastructure.Interfaces
{
    public interface IJwtHandler
    {
        string WriteToken(JwtSecurityToken jwt);
        ClaimsPrincipal? ValidateToken(string token, TokenValidationParameters tokenValidationParameters);
    }
}
