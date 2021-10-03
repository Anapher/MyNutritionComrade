using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace CommunityCatalog.Infrastructure.Interfaces
{
    public interface IJwtHandler
    {
        string WriteToken(JwtSecurityToken jwt);
        ClaimsPrincipal? ValidateToken(string token, TokenValidationParameters tokenValidationParameters);
    }
}
