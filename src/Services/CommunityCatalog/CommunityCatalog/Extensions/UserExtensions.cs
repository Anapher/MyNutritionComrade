using System.Linq;
using System.Security.Claims;
using CommunityCatalog.Infrastructure.Auth;

namespace CommunityCatalog.Extensions
{
    public static class UserExtensions
    {
        public static string GetUserId(this ClaimsPrincipal principal)
        {
            return principal.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;
        }

        public static bool IsAdmin(this ClaimsPrincipal principal)
        {
            return principal.Claims.Any(x =>
                x.Type == Constants.Strings.JwtClaimIdentifiers.Rol && x.Value == Constants.Strings.JwtRoles.Admin);
        }
    }
}
