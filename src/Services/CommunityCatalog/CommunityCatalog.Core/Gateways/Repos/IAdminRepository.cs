using System.Threading.Tasks;

namespace CommunityCatalog.Core.Gateways.Repos
{
    public interface IAdminRepository
    {
        ValueTask<bool> IsAdmin(string emailAddress);
    }
}
