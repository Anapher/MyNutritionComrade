using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace CommunityCatalog.Infrastructure.Auth
{
    public class AuthSettings
    {
        public string SecretKey { get; set; } = "test";

        /// <summary>
        ///     The signing key to use when generating tokens.
        /// </summary>
        public SigningCredentials SigningCredentials =>
            new(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(SecretKey)), SecurityAlgorithms.HmacSha256);
    }
}
