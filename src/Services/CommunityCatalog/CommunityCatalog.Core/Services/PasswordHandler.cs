using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using CommunityCatalog.Core.Gateways.Services;
using CommunityCatalog.Core.Options;
using Microsoft.Extensions.Options;

namespace CommunityCatalog.Core.Services
{
    public class PasswordHandler : IPasswordHandler, IDisposable
    {
        private readonly IdentityOptions _options;
        private readonly MD5 _md5 = MD5.Create();

        public PasswordHandler(IOptions<IdentityOptions> options)
        {
            _options = options.Value;
        }

        public byte[] GetSaltedEmailHash(string emailAddress)
        {
            var emailSource = emailAddress + _options.EmailSalt;
            var emailBytes = Encoding.UTF8.GetBytes(emailSource);
            return _md5.ComputeHash(emailBytes);
        }

        public byte[] GeneratePassword(string emailAddress, TimeSpan validFor)
        {
            var validUntil = GetValidUntilTimestamp(validFor);
            var validUntilBytes = BitConverter.GetBytes(validUntil);

            var passwordDataSecret = ComputePasswordHash(emailAddress, validUntil);

            var passwordToken = passwordDataSecret.Concat(validUntilBytes).ToArray();
            return passwordToken;
        }

        private byte[] ComputePasswordHash(string emailAddress, uint validUntil)
        {
            var emailHashBytes = GetSaltedEmailHash(emailAddress);
            var validUntilBytes = BitConverter.GetBytes(validUntil);

            var passwordSecret = Encoding.UTF8.GetBytes(_options.SecretKey);
            var passwordDataSecret = emailHashBytes.Concat(passwordSecret).Concat(validUntilBytes).ToArray();
            return _md5.ComputeHash(passwordDataSecret);
        }

        public bool ValidatePassword(string emailAddress, byte[] token)
        {
            if (token.Length != 20)
                return false;

            var validUntil = BitConverter.ToUInt32(token.AsSpan().Slice(16, 4));

            var givenPasswordHash = token.AsSpan()[..16];
            var expectedPasswordHash = ComputePasswordHash(emailAddress, validUntil);
            if (!givenPasswordHash.SequenceEqual(expectedPasswordHash))
                return false;

            var expiryDate = IdentityOptions.EpocheStart.AddHours(validUntil);
            return expiryDate > DateTimeOffset.UtcNow;
        }

        /// <summary>
        ///     Get valid until timestamp as hours since the <see cref="IdentityOptions.EpocheStart" />
        /// </summary>
        private static uint GetValidUntilTimestamp(TimeSpan validFor)
        {
            return (uint)Math.Floor(
                DateTimeOffset.UtcNow.Add(validFor).Subtract(IdentityOptions.EpocheStart).TotalHours + 1);
        }

        public void Dispose()
        {
            _md5.Dispose();
        }
    }
}
