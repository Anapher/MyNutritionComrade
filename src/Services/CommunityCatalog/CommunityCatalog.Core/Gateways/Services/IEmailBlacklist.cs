using System.Threading.Tasks;

namespace CommunityCatalog.Core.Gateways.Services
{
    public interface IEmailBlacklist
    {
        ValueTask<bool> CheckEmailAddressOkay(string emailHash);
    }
}
