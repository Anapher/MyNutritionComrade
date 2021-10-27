using System.Threading.Tasks;
using CommunityCatalog.Core.Gateways.Services;

namespace CommunityCatalog.Infrastructure.Mail
{
    public class NoopBlacklist : IEmailBlacklist
    {
        public ValueTask<bool> CheckEmailAddressOkay(string emailHash)
        {
            return new ValueTask<bool>(true);
        }
    }
}
