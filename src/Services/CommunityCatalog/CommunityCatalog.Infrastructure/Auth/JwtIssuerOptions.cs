using System;
using System.Threading.Tasks;

namespace CommunityCatalog.Infrastructure.Auth
{
    public class JwtIssuerOptions
    {
        /// <summary>
        /// 4.1.1.  "iss" (Issuer) Claim - The "iss" (issuer) claim identifies the principal that issued the JWT.
        /// </summary>
        public string? Issuer { get; set; }

        /// <summary>
        ///     4.1.3.  "aud" (Audience) Claim - The "aud" (audience) claim identifies the recipients that the JWT is intended for.
        /// </summary>
        public string? Audience { get; set; }

        /// <summary>
        /// 4.1.4.  "exp" (Expiration Time) Claim - The "exp" (expiration time) claim identifies the expiration time on or after which the JWT MUST NOT be accepted for processing.
        /// </summary>
        public DateTimeOffset Expiration => IssuedAt.Add(ValidFor);

        /// <summary>
        /// 4.1.5.  "nbf" (Not Before) Claim - The "nbf" (not before) claim identifies the time before which the JWT MUST NOT be accepted for processing.
        /// </summary>
        public DateTimeOffset NotBefore => DateTimeOffset.UtcNow;

        /// <summary>
        /// 4.1.6.  "iat" (Issued At) Claim - The "iat" (issued at) claim identifies the time at which the JWT was issued.
        /// </summary>
        public DateTimeOffset IssuedAt => DateTimeOffset.UtcNow;

        /// <summary>
        ///     Set the timespan the token will be valid for (default is 1 year)
        /// </summary>
        public TimeSpan ValidFor { get; set; } = TimeSpan.FromDays(364.25);

        /// <summary>
        /// "jti" (JWT ID) Claim (default ID is a GUID)
        /// </summary>
        public Func<ValueTask<string>> JtiGenerator => () => new ValueTask<string>(Guid.NewGuid().ToString());
    }
}