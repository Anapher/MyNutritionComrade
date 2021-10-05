
using System.Threading.Tasks;

namespace CommunityCatalog.Core.Gateways.Services
{
    public interface IJwtFactory
    {
        Task<string> GenerateEncodedToken(string email, bool isAdmin);
    }
}