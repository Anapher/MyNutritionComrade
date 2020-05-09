using System;
using System.Collections.Generic;
using System.Linq;

namespace MyNutritionComrade.Core.Domain.Entities.Account
{
    public class User
    {
        private readonly List<RefreshToken> _refreshTokens = new List<RefreshToken>();

        public User(string id, UserMetadata userMetadata)
        {
            Id = id;
            Metadata = userMetadata;
        }

        public string Id { get; private set; }
        public bool IsDisabled { get; set; }
        public UserMetadata Metadata { get; private set; }
        public bool IsTrustworthy { get; set; }
        public IReadOnlyCollection<RefreshToken> RefreshTokens => _refreshTokens.AsReadOnly();

        public bool HasValidRefreshToken(string refreshToken)
        {
            return _refreshTokens.Any(rt => rt.Token == refreshToken && rt.Active);
        }

        public void AddRefreshToken(string token, string? remoteIpAddress, double daysToExpire = 5)
        {
            _refreshTokens.Add(new RefreshToken(token, DateTimeOffset.UtcNow.AddDays(daysToExpire), remoteIpAddress));
        }

        public void RemoveRefreshToken(string refreshToken)
        {
            _refreshTokens.Remove(_refreshTokens.First(t => t.Token == refreshToken));
        }
    }
}
