using System;
using MyNutritionComrade.Core.Shared;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class RefreshToken : BaseEntity
    {
        public RefreshToken(string token, DateTimeOffset expires, string? remoteIpAddress)
        {
            Token = token;
            Expires = expires;
            RemoteIpAddress = remoteIpAddress;
        }

        public string? AppUserId { get; private set; }

        public string Token { get; private set; }
        public DateTimeOffset Expires { get; private set; }
        public bool Active => DateTimeOffset.UtcNow <= Expires;
        public string? RemoteIpAddress { get; private set; }
    }
}
