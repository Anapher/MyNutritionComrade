using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using CommunityCatalog.Core.Gateways.Services;
using CommunityCatalog.Infrastructure.Interfaces;
using Microsoft.Extensions.Options;

namespace CommunityCatalog.Infrastructure.Auth
{
    public class JwtFactory : IJwtFactory
    {
        private readonly JwtIssuerOptions _jwtOptions;
        private readonly AuthSettings _authOptions;
        private readonly IJwtHandler _jwtHandler;

        public JwtFactory(IJwtHandler jwtHandler, IOptions<JwtIssuerOptions> options,
            IOptions<AuthSettings> authOptions)
        {
            _jwtOptions = options.Value;
            _jwtHandler = jwtHandler;
            _authOptions = authOptions.Value;

            ThrowIfInvalidOptions(_jwtOptions);
        }

        public async Task<string> GenerateEncodedToken(string email)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()),
                new Claim(JwtRegisteredClaimNames.Iat, _jwtOptions.IssuedAt.ToUnixTimeSeconds().ToString(),
                    ClaimValueTypes.Integer64),
                new Claim(Constants.Strings.JwtClaimIdentifiers.Rol, Constants.Strings.JwtClaims.ApiAccess),
            };

            // Create the JWT security token and encode it.
            var jwt = new JwtSecurityToken(_jwtOptions.Issuer, _jwtOptions.Audience, claims,
                _jwtOptions.NotBefore.UtcDateTime, _jwtOptions.Expiration.UtcDateTime, _authOptions.SigningCredentials);

            return _jwtHandler.WriteToken(jwt);
        }

        private static void ThrowIfInvalidOptions(JwtIssuerOptions options)
        {
            if (options == null) throw new ArgumentNullException(nameof(options));

            if (options.ValidFor <= TimeSpan.Zero)
            {
                throw new ArgumentException("Must be a non-zero TimeSpan.", nameof(JwtIssuerOptions.ValidFor));
            }

            if (options.JtiGenerator == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.JtiGenerator));
            }
        }
    }
}