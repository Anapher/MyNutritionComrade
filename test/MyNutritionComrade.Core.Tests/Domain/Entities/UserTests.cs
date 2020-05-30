using MyNutritionComrade.Core.Tests._Helpers;
using Xunit;

namespace MyNutritionComrade.Core.Tests.Domain.Entities
{
    public class UserTests
    {
        [Fact]
        public void HasValidRefreshToken_GivenExpiredToken_ShouldReturnFalse()
        {
            // arrange
            const string refreshToken = "1234";
            var user = UserHelper.Default();
            user.AddRefreshToken(refreshToken, "127.0.0.1", -6); // Provision with token 6 days old

            // act
            var result = user.HasValidRefreshToken(refreshToken);

            Assert.False(result);
        }

        [Fact]
        public void HasValidRefreshToken_GivenValidToken_ShouldReturnTrue()
        {
            // arrange
            const string refreshToken = "1234";
            var user = UserHelper.Default();
            user.AddRefreshToken(refreshToken, "127.0.0.1");

            // act
            var result = user.HasValidRefreshToken(refreshToken);

            Assert.True(result);
        }
    }
}
