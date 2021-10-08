using System.Collections.Generic;

namespace CommunityCatalog.Infrastructure.Auth
{
    public class AdminOptions
    {
        public List<string> AdminEmailAddresses { get; set; } = new();
    }
}
