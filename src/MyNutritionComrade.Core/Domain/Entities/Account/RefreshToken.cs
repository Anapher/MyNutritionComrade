using System;
using Newtonsoft.Json;

namespace MyNutritionComrade.Core.Domain.Entities.Account
{
    public class RefreshToken
    {
        public RefreshToken(string token, DateTimeOffset expires, string? remoteIpAddress)
        {
            Token = token;
            Expires = expires;
            RemoteIpAddress = remoteIpAddress;
        }

        public string Token { get; private set; }
        public DateTimeOffset Expires { get; private set; }
        public string? RemoteIpAddress { get; private set; }
        public DateTimeOffset CreatedOn { get; private set; } = DateTimeOffset.UtcNow;

        [JsonIgnore]
        public bool Active => DateTimeOffset.UtcNow <= Expires;
    }
}
