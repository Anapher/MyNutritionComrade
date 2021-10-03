using System.Security.Claims;

namespace CommunityCatalog.Core.Gateways.Services
{
    public interface IJwtValidator
    {
        ClaimsPrincipal? GetPrincipalFromToken(string token);
    }
}