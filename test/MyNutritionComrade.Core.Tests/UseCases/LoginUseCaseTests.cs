using System.Threading.Tasks;
using Microsoft.Extensions.Logging.Abstractions;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Core.UseCases;
using Moq;
using MyNutritionComrade.Core.Domain.Entities.Account;
using MyNutritionComrade.Core.Tests._Helpers;
using Xunit;

namespace MyNutritionComrade.Core.Tests.UseCases
{
    public class LoginUseCaseTests
    {
        [Fact]
        public async Task TestValidNewGoogleLogin()
        {
            // arrange
            var request = new GoogleLoginRequest("12345", "test@email.com", "127.0.0.1");

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(x => x.FindById(It.IsAny<string>())).ReturnsAsync((User) null);

            var mockJwtFactory = new Mock<IJwtFactory>();
            mockJwtFactory.Setup(factory => factory.GenerateEncodedToken(It.IsAny<string>())).ReturnsAsync("token");

            var mockTokenFactory = new Mock<ITokenFactory>();
            mockTokenFactory.Setup(x => x.GenerateToken(It.IsAny<int>())).Returns("simple token");

            var useCase = new LoginUseCase(mockUserRepository.Object, mockJwtFactory.Object, mockTokenFactory.Object, new NullLogger<LoginUseCase>());

            // act
            var response = await useCase.Handle(request);

            // assert
            Assert.False(useCase.HasError);

            mockUserRepository.Verify(x => x.Create(It.IsAny<User>()), Times.Once);
            mockUserRepository.Verify(x => x.Update(It.IsAny<User>()), Times.Once);
            Assert.NotNull(response.AccessToken);
            Assert.NotNull(response.RefreshToken);
        }

        [Fact]
        public async Task TestValidExistingGoogleLogin()
        {
            // arrange
            var request = new GoogleLoginRequest("12345", "test@email.com", "127.0.0.1");

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(x => x.FindById(It.IsAny<string>())).ReturnsAsync(UserHelper.Default("12345"));

            var mockJwtFactory = new Mock<IJwtFactory>();
            mockJwtFactory.Setup(factory => factory.GenerateEncodedToken(It.IsAny<string>())).ReturnsAsync("token");

            var mockTokenFactory = new Mock<ITokenFactory>();
            mockTokenFactory.Setup(x => x.GenerateToken(It.IsAny<int>())).Returns("simple token");

            var useCase = new LoginUseCase(mockUserRepository.Object, mockJwtFactory.Object, mockTokenFactory.Object, new NullLogger<LoginUseCase>());

            // act
            var response = await useCase.Handle(request);

            // assert
            Assert.False(useCase.HasError);

            mockUserRepository.Verify(x => x.Create(It.IsAny<User>()), Times.Never);
            mockUserRepository.Verify(x => x.Update(It.IsAny<User>()), Times.Once);
            Assert.NotNull(response.AccessToken);
            Assert.NotNull(response.RefreshToken);
        }

        [Fact]
        public async Task TestDisabledExistingGoogleLogin()
        {
            // arrange
            var request = new GoogleLoginRequest("12345", "test@email.com", "127.0.0.1");

            var user = UserHelper.Default("12345");
            user.IsDisabled = true;

            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(x => x.FindById(It.IsAny<string>())).ReturnsAsync(user);

            var mockJwtFactory = new Mock<IJwtFactory>();
            mockJwtFactory.Setup(factory => factory.GenerateEncodedToken(It.IsAny<string>())).ReturnsAsync("token");

            var mockTokenFactory = new Mock<ITokenFactory>();
            mockTokenFactory.Setup(x => x.GenerateToken(It.IsAny<int>())).Returns("simple token");

            var useCase = new LoginUseCase(mockUserRepository.Object, mockJwtFactory.Object, mockTokenFactory.Object, new NullLogger<LoginUseCase>());

            // act
            var response = await useCase.Handle(request);

            // assert
            Assert.True(useCase.HasError);

            mockUserRepository.Verify(x => x.Create(It.IsAny<User>()), Times.Never);
            mockUserRepository.Verify(x => x.Update(It.IsAny<User>()), Times.Never);
            Assert.Null(response);
        }
    }
}
