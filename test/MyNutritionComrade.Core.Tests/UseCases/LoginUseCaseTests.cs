using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Core.UseCases;
using Moq;
using MyNutritionComrade.Core.Domain.Entities.Account;
using Xunit;

namespace MyNutritionComrade.Core.Tests.UseCases
{
    public class LoginUseCaseTests
    {
        [Fact]
        public async void Handle_GivenValidCredentials_ShouldSucceed()
        {
            // arrange
            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.FindByName(It.IsAny<string>())).ReturnsAsync(new User("", "", ""));

            mockUserRepository.Setup(repo => repo.CheckPassword(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(true);

            var mockJwtFactory = new Mock<IJwtFactory>();
            mockJwtFactory.Setup(factory => factory.GenerateEncodedToken(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("");

            var mockTokenFactory = new Mock<ITokenFactory>();

            var useCase = new LoginUseCase(mockUserRepository.Object, mockJwtFactory.Object, mockTokenFactory.Object);

            // act
            var response = await useCase.Handle(new LoginRequest("userName", "password", "127.0.0.1"));

            // assert
            Assert.False(useCase.HasError);
        }

        [Fact]
        public async void Handle_GivenIncompleteCredentials_ShouldFail()
        {
            // arrange
            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.FindByName(It.IsAny<string>())).ReturnsAsync(new User("", "", ""));

            mockUserRepository.Setup(repo => repo.CheckPassword(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(false);

            var mockJwtFactory = new Mock<IJwtFactory>();
            mockJwtFactory.Setup(factory => factory.GenerateEncodedToken(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("");

            var mockTokenFactory = new Mock<ITokenFactory>();

            var useCase = new LoginUseCase(mockUserRepository.Object, mockJwtFactory.Object, mockTokenFactory.Object);

            // act
            await useCase.Handle(new LoginRequest("", "password", "127.0.0.1"));

            // assert
            Assert.True(useCase.HasError);
            mockTokenFactory.Verify(factory => factory.GenerateToken(32), Times.Never);
        }

        [Fact]
        public async void Handle_GivenUnknownCredentials_ShouldFail()
        {
            // arrange
            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.FindByName(It.IsAny<string>())).ReturnsAsync((User)null);

            mockUserRepository.Setup(repo => repo.CheckPassword(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(true);

            var mockJwtFactory = new Mock<IJwtFactory>();
            mockJwtFactory.Setup(factory => factory.GenerateEncodedToken(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("");

            var mockTokenFactory = new Mock<ITokenFactory>();

            var useCase = new LoginUseCase(mockUserRepository.Object, mockJwtFactory.Object, mockTokenFactory.Object);

            // act
            await useCase.Handle(new LoginRequest("", "password", "127.0.0.1"));

            // assert
            Assert.True(useCase.HasError);
            mockTokenFactory.Verify(factory => factory.GenerateToken(32), Times.Never);
        }

        [Fact]
        public async void Handle_GivenInvalidPassword_ShouldFail()
        {
            // arrange
            var mockUserRepository = new Mock<IUserRepository>();
            mockUserRepository.Setup(repo => repo.FindByName(It.IsAny<string>())).ReturnsAsync((User)null);

            mockUserRepository.Setup(repo => repo.CheckPassword(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(false);

            var mockJwtFactory = new Mock<IJwtFactory>();
            mockJwtFactory.Setup(factory => factory.GenerateEncodedToken(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("");

            var mockTokenFactory = new Mock<ITokenFactory>();

            var useCase = new LoginUseCase(mockUserRepository.Object, mockJwtFactory.Object, mockTokenFactory.Object);

            // act
            await useCase.Handle(new LoginRequest("", "password", "127.0.0.1"));

            // assert
            Assert.True(useCase.HasError);
            mockTokenFactory.Verify(factory => factory.GenerateToken(32), Times.Never);
        }
    }
}
