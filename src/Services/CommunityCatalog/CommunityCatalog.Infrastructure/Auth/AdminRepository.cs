using System.Threading.Tasks;
using CommunityCatalog.Core.Gateways.Repos;
using Microsoft.Extensions.Options;

namespace CommunityCatalog.Infrastructure.Auth
{
    public class AdminRepository : IAdminRepository
    {
        private readonly AdminOptions _options;

        public AdminRepository(IOptions<AdminOptions> options)
        {
            _options = options.Value;
        }

        public ValueTask<bool> IsAdmin(string emailAddress)
        {
            // no case insensitive comparison as email addresses must not be case insensitive
            // -> would be a possible exploit
            return new ValueTask<bool>(_options.AdminEmailAddresses.Contains(emailAddress));
        }
    }
}
