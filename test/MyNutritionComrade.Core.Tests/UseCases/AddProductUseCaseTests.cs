//using System.Threading.Tasks;
//using Microsoft.Extensions.Logging.Abstractions;
//using Moq;
//using MyNutritionComrade.Core.Domain;
//using MyNutritionComrade.Core.Domain.Entities;
//using MyNutritionComrade.Core.Domain.Entities.Account;
//using MyNutritionComrade.Core.Dto;
//using MyNutritionComrade.Core.Dto.UseCaseRequests;
//using MyNutritionComrade.Core.Dto.UseCaseResponses;
//using MyNutritionComrade.Core.Errors;
//using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
//using MyNutritionComrade.Core.Interfaces.UseCases;
//using MyNutritionComrade.Core.Services;
//using MyNutritionComrade.Core.UseCases;
//using MyNutritionComrade.Infrastructure.Patch;
//using Xunit;

//namespace MyNutritionComrade.Core.Tests.UseCases
//{
//    public class AddProductUseCaseTests
//    {
//        [Fact]
//        public async Task TestCreateProductNonExistingUser()
//        {
//            const string userId = "e15eb7c2-38ee-444a-8f82-c57a66ffc982";

//            // arrange
//            var mockProductRepo = new Mock<IProductRepository>();
//            var mockUserRepo = new Mock<IUserRepository>();
//            var manipulationUtils = new ManipulationUtils();
//            var validator = new ProductPatchValidator(manipulationUtils, new NullLogger<ProductPatchValidator>());
//            var applyContributionUseCase = new ApplyProductContributionUseCase(null, null, manipulationUtils,
//                validator, new NullLogger<ApplyProductContributionUseCase>());

//            var useCase = new AddProductUseCase(mockProductRepo.Object, mockUserRepo.Object, manipulationUtils, applyContributionUseCase);

//            var product = new ProductInfo();
//            product.NutritionalInfo = new NutritionalInfo(100, 200, 0, 0, 0, 0, 0, 0, 0);
//            product.AddProductLabel("Haferflocken", "de");
//            product.AddProductServing(ServingType.Gram, 1);
//            product.DefaultServing = ServingType.Gram;

//            mockUserRepo.Setup(x => x.FindById(userId)).ReturnsAsync((User) null);

//            // act
//            await useCase.Handle(new AddProductRequest(product, userId));

//            // assert
//            Assert.True(useCase.HasError);
//            Assert.Equal(ErrorCode.UserNotFound, (ErrorCode) useCase.Error.Code);
//            mockProductRepo.VerifyNoOtherCalls();
//        }

//        [Fact]
//        public async Task TestCreateProductDatabaseInsertionFails()
//        {
//            const string userId = "e15eb7c2-38ee-444a-8f82-c57a66ffc982";

//            // arrange
//            var mockProductRepo = new Mock<IProductRepository>();
//            var mockUserRepo = new Mock<IUserRepository>();
//            var manipulationUtils = new ManipulationUtils();
//            var validator = new ProductPatchValidator(manipulationUtils, new NullLogger<ProductPatchValidator>());
//            var applyContributionUseCase = new ApplyProductContributionUseCase(null, null, manipulationUtils,
//                validator, new NullLogger<ApplyProductContributionUseCase>());

//            var useCase = new AddProductUseCase(mockProductRepo.Object, mockUserRepo.Object, manipulationUtils, applyContributionUseCase);

//            var product = new ProductInfo();
//            product.NutritionalInfo = new NutritionalInfo(100, 200, 0, 0, 0, 0, 0, 0, 0);
//            product.AddProductLabel("Haferflocken", "de");
//            product.AddProductServing(ServingType.Gram, 1);
//            product.DefaultServing = ServingType.Gram;

//            mockUserRepo.Setup(x => x.FindById(userId)).ReturnsAsync(new User(userId, "Vincent", "pw"));
//            mockProductRepo.Setup(x => x.Add(It.IsAny<Product>(), It.IsAny<ProductContribution>())).ReturnsAsync(false);

//            // act
//            await useCase.Handle(new AddProductRequest(product, userId));

//            // assert
//            Assert.True(useCase.HasError);
//            Assert.Equal(ErrorCode.Product_CodeAlreadyExists, (ErrorCode) useCase.Error.Code);

//            mockProductRepo.Verify(x => x.Add(It.IsAny<Product>(), It.IsAny<ProductContribution>()), Times.Once);
//            mockProductRepo.VerifyNoOtherCalls();
//        }

//        [Fact]
//        public async Task TestCreateProduct()
//        {
//            const string userId = "e15eb7c2-38ee-444a-8f82-c57a66ffc982";

//            // arrange
//            var mockProductRepo = new Mock<IProductRepository>();
//            var mockUserRepo = new Mock<IUserRepository>();
//            var manipulationUtils = new ManipulationUtils();
//            var validator = new ProductPatchValidator(manipulationUtils, new NullLogger<ProductPatchValidator>());
//            var applyContributionUseCase = new ApplyProductContributionUseCase(null, null, manipulationUtils,
//                validator, new NullLogger<ApplyProductContributionUseCase>());

//            var useCase = new AddProductUseCase(mockProductRepo.Object, mockUserRepo.Object, manipulationUtils, applyContributionUseCase);

//            var product = new ProductInfo{Code = "123456"};
//            product.NutritionalInfo = new NutritionalInfo(100, 200, 0, 0, 0, 0, 0, 0, 0);
//            product.AddProductLabel("Haferflocken", "de");
//            product.AddProductServing(ServingType.Gram, 1);
//            product.DefaultServing = ServingType.Gram;

//            mockUserRepo.Setup(x => x.FindById(userId)).ReturnsAsync(new User(userId, "Vincent", "pw"));
//            mockProductRepo.Setup(x => x.Add(It.IsAny<Product>(), It.IsAny<ProductContribution>())).Callback((Product p, ProductContribution contribution) =>
//            {
//                Assert.NotEmpty(p.Id);
//                Assert.Equal(ProductContributionStatus.Applied, contribution.Status);
//                Assert.Equal(p.Version, contribution.AppliedVersion);
//                Assert.Equal("123456", p.Code);
//                Assert.Equal(ServingType.Gram, p.DefaultServing);
//                var l = Assert.Single(p.Label);
//                Assert.Equal("Haferflocken", l.Value);
//                Assert.Equal("de", l.LanguageCode);

//                Assert.NotNull(contribution.PatchHash);
//                Assert.NotNull(contribution.StatusDescription);
//                Assert.NotEmpty(contribution.Patch);
//            }).ReturnsAsync(true);

//            // act
//            await useCase.Handle(new AddProductRequest(product, userId));

//            // assert
//            Assert.False(useCase.HasError);

//            mockProductRepo.Verify(x => x.Add(It.IsAny<Product>(), It.IsAny<ProductContribution>()), Times.Once);
//            mockProductRepo.VerifyNoOtherCalls();
//        }

//        [Fact]
//        public async Task TestCreateProductApplyFails()
//        {
//            const string userId = "e15eb7c2-38ee-444a-8f82-c57a66ffc982";

//            // arrange
//            var mockProductRepo = new Mock<IProductRepository>();
//            var mockUserRepo = new Mock<IUserRepository>();
//            var manipulationUtils = new ManipulationUtils();

//            var mockApplyContributionUseCase = new Mock<IApplyProductContributionUseCase>();
//            mockApplyContributionUseCase.Setup(x => x.Handle(It.IsAny<ApplyProductContributionRequest>()))
//                .ReturnsAsync((ApplyProductContributionResponse) null);
//            mockApplyContributionUseCase.SetupGet(x => x.HasError).Returns(true);
//            mockApplyContributionUseCase.SetupGet(x => x.Error).Returns(new Error("test", "test", -1));

//            var useCase = new AddProductUseCase(mockProductRepo.Object, mockUserRepo.Object, manipulationUtils, mockApplyContributionUseCase.Object);

//            var product = new ProductInfo();
//            product.NutritionalInfo = new NutritionalInfo(100, 200, 0, 0, 0, 0, 0, 0, 0);
//            product.AddProductLabel("Haferflocken", "de");
//            product.AddProductServing(ServingType.Gram, 1);
//            product.DefaultServing = ServingType.Gram;

//            mockUserRepo.Setup(x => x.FindById(userId)).ReturnsAsync(new User(userId, "Vincent", "pw"));

//            // act
//            await useCase.Handle(new AddProductRequest(product, userId));

//            // assert
//            Assert.True(useCase.HasError);
//            Assert.Equal(-1, useCase.Error.Code);

//            mockProductRepo.VerifyNoOtherCalls();
//        }
//    }
//}
