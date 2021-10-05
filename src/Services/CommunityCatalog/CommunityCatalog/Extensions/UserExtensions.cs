using System.Linq;
using System.Security.Claims;

namespace CommunityCatalog.Extensions
{
    public static class UserExtensions
    {
        public static string GetUserId(this ClaimsPrincipal principal)
        {
            return principal.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;
        }
    }
}
