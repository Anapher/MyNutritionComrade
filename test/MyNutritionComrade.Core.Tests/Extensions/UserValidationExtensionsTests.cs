using System.Threading.Tasks;
using Moq;
using MyNutritionComrade.Core.Domain.Entities.Account;
using MyNutritionComrade.Core.Extensions;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Tests._Helpers;
using Xunit;

namespace MyNutritionComrade.Core.Tests.Extensions
{
    public class UserValidationExtensionsTests
    {
        [Fact]
        public async Task TestValidateNonExistingUser()
        {
            // arrange
            var mockRepo = new Mock<IUserRepository>();
            mockRepo.Setup(x => x.FindById(It.IsAny<string>())).ReturnsAsync((User) null);

            // act
            var result = await mockRepo.Object.ValidateUser("test id");

            // assert
            Assert.False(result.IsValid);
            Assert.False(result.Result(out _, out _));
            Assert.NotNull(result.Error);
        }

        [Fact]
        public async Task TestValidateDisabledUser()
        {
            // arrange
            var user = UserHelper.Default();
            user.IsDisabled = true;

            var mockRepo = new Mock<IUserRepository>();
            mockRepo.Setup(x => x.FindById("test id")).ReturnsAsync(user);

            // act
            var result = await mockRepo.Object.ValidateUser("test id");

            // assert
            Assert.False(result.IsValid);
            Assert.False(result.Result(out _, out _));
            Assert.NotNull(result.Error);
        }

        [Fact]
        public async Task TestValidUser()
        {
            // arrange
            var user = UserHelper.Default("test id");

            var mockRepo = new Mock<IUserRepository>();
            mockRepo.Setup(x => x.FindById("test id")).ReturnsAsync(user);

            // act
            var result = await mockRepo.Object.ValidateUser("test id");

            // assert
            Assert.True(result.IsValid);
            Assert.True(result.Result(out _, out _));
            Assert.Null(result.Error);
        }
    }
}
