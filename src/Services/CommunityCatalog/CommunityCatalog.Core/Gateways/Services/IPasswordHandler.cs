using System;

namespace CommunityCatalog.Core.Gateways.Services
{
    public interface IPasswordHandler
    {
        /// <summary>
        ///     hash(emailAddress + salt)
        /// </summary>
        byte[] GetSaltedEmailHash(string emailAddress);

        /// <summary>
        ///     hash(hash(emailAddress + salt) + secret + validUntil) + validUntil
        /// </summary>
        /// <param name="emailAddress"></param>
        /// <param name="validFor"></param>
        /// <returns></returns>
        byte[] GeneratePassword(string emailAddress, TimeSpan validFor);

        bool ValidatePassword(string emailAddress, byte[] token);
    }
}
