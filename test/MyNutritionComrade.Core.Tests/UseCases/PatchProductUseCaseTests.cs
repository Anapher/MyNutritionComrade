//using System;
//using System.Collections.Generic;
//using System.Threading.Tasks;
//using FluentValidation.Results;
//using Microsoft.Extensions.Logging;
//using Microsoft.Extensions.Logging.Abstractions;
//using Moq;
//using MyNutritionComrade.Core.Domain;
//using MyNutritionComrade.Core.Domain.Entities;
//using MyNutritionComrade.Core.Domain.Entities.Account;
//using MyNutritionComrade.Core.Dto;
//using MyNutritionComrade.Core.Dto.UseCaseRequests;
//using MyNutritionComrade.Core.Errors;
//using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
//using MyNutritionComrade.Core.Interfaces.Services;
//using MyNutritionComrade.Core.Interfaces.UseCases;
//using MyNutritionComrade.Core.Services;
//using MyNutritionComrade.Core.UseCases;
//using MyNutritionComrade.Infrastructure.Patch;
//using Newtonsoft.Json.Linq;
//using Xunit;

//namespace MyNutritionComrade.Core.Tests.UseCases
//{
//    public class PatchProductUseCaseTests
//    {
//        protected readonly Mock<IUserRepository> UserRepo = new Mock<IUserRepository>();
//        protected readonly Mock<IProductRepository> ProductRepo = new Mock<IProductRepository>();
//        protected readonly Mock<IProductContributionRepository> ContributionRepo = new Mock<IProductContributionRepository>();
//        protected readonly IObjectManipulationUtils ManipulationUtils = new ManipulationUtils();
//        protected readonly Mock<IServiceProvider> ComponentContext = new Mock<IServiceProvider>();
//        protected readonly Mock<IProductPatchValidator> Validator = new Mock<IProductPatchValidator>();
//        protected readonly IProductPatchGrouper Grouper = new ProductPatchGrouper();
//        protected readonly ILogger<PatchProductUseCase> Logger = new NullLogger<PatchProductUseCase>();

//        private string HasValidUser(bool isTrustworthy = false)
//        {
//            var userId = "123";
//            UserRepo.Setup(x => x.FindById("123")).ReturnsAsync(new User(userId, "Vincent", "pw") { IsTrustworthy = isTrustworthy });

//            return userId;
//        }

//        private string HasValidProduct()
//        {
//            var productId = "ABC";
//            ProductRepo.Setup(x => x.FindById(productId)).ReturnsAsync(new Product(productId) {Code = "123456"});
//            return productId;
//        }

//        private IReadOnlyList<PatchOperation> GetValidPatchOperations() =>
//            new List<PatchOperation> { new OpSetProperty("code", JToken.FromObject("123456")), new OpSetProperty("servings.piece", JToken.FromObject(45)) };

//        [Fact]
//        public async Task TestUserNotFound()
//        {
//            // arrange
//            var useCase = new PatchProductUseCase(UserRepo.Object, ProductRepo.Object, ContributionRepo.Object, ManipulationUtils, ComponentContext.Object,
//                Validator.Object, Grouper, Logger);

//            UserRepo.Setup(x => x.FindById("123")).ReturnsAsync((User)null);

//            // act
//            await useCase.Handle(new PatchProductRequest("ABC", GetValidPatchOperations(), "123"));

//            // assert
//            Assert.True(useCase.HasError);
//            Assert.Equal(ErrorCode.UserNotFound, (ErrorCode)useCase.Error.Code);

//            ContributionRepo.VerifyNoOtherCalls();
//            ProductRepo.VerifyNoOtherCalls();
//        }

//        [Fact]
//        public async Task TestProductNotFound()
//        {
//            // arrange
//            var useCase = new PatchProductUseCase(UserRepo.Object, ProductRepo.Object, ContributionRepo.Object, ManipulationUtils, ComponentContext.Object,
//                Validator.Object, Grouper, Logger);

//            var userId = HasValidUser();
//            ProductRepo.Setup(x => x.FindById("ABC")).ReturnsAsync((Product) null);

//            // act
//            await useCase.Handle(new PatchProductRequest("ABC", GetValidPatchOperations(), userId));

//            // assert
//            Assert.True(useCase.HasError);
//            Assert.Equal(ErrorCode.Product_NotFound, (ErrorCode)useCase.Error.Code);

//            ProductRepo.Verify(x => x.FindById("ABC"), Times.Once);
//            ContributionRepo.VerifyNoOtherCalls();
//            ProductRepo.VerifyNoOtherCalls();
//        }

//        [Fact]
//        public async Task TestPatchExecutionFails()
//        {
//            // arrange
//            var mockManipulationUtils = new Mock<IObjectManipulationUtils>();
//            mockManipulationUtils.Setup(x => x.Clone(It.IsAny<object>())).Returns((object o) => o);
//            mockManipulationUtils.Setup(x => x.ExecutePatch(It.IsAny<IEnumerable<PatchOperation>>(), It.IsAny<object>())).Throws(new Exception());

//            var useCase = new PatchProductUseCase(UserRepo.Object, ProductRepo.Object, ContributionRepo.Object, mockManipulationUtils.Object, ComponentContext.Object,
//                Validator.Object, Grouper, Logger);

//            var userId = HasValidUser();
//            var productId = HasValidProduct();

//            // act
//            await useCase.Handle(new PatchProductRequest(productId, GetValidPatchOperations(), userId));

//            // assert
//            Assert.True(useCase.HasError);
//            Assert.Equal(ErrorCode.FieldValidation, (ErrorCode)useCase.Error.Code);

//            ProductRepo.Verify(x => x.FindById(productId), Times.Once);
//            ContributionRepo.VerifyNoOtherCalls();
//            ProductRepo.VerifyNoOtherCalls();
//        }

//        [Fact]
//        public async Task TestFilterUselessOperationsAndReturn()
//        {
//            // arrange
//            var useCase = new PatchProductUseCase(UserRepo.Object, ProductRepo.Object, ContributionRepo.Object, ManipulationUtils, ComponentContext.Object,
//                Validator.Object, Grouper, Logger);

//            var userId = HasValidUser();
//            var productId = HasValidProduct();

//            // act
//            await useCase.Handle(new PatchProductRequest(productId, new PatchOperation[] {new OpSetProperty("code", JToken.FromObject("123456"))}, userId));

//            // assert
//            Assert.False(useCase.HasError);

//            ProductRepo.Verify(x => x.FindById(productId), Times.Once);
//            ContributionRepo.VerifyNoOtherCalls();
//            ProductRepo.VerifyNoOtherCalls();
//        }

//        [Fact]
//        public async Task TestApplyPatchIfUserIsTrustworthy()
//        {
//            // arrange
//            var operations = new List<PatchOperation>
//            {
//                new OpSetProperty("code", JToken.FromObject("123456")), new OpSetProperty("servings.piece", JToken.FromObject(45))
//            };

//            var userId = HasValidUser(true);
//            var productId = HasValidProduct();

//            ContributionRepo.Setup(x => x.Add(It.IsAny<ProductContribution>())).Callback((ProductContribution c) =>
//            {
//                Assert.Equal(userId, c.UserId);
//                Assert.Equal(productId, c.ProductId);
//                var patchOp = Assert.Single(c.Patch);
//                Assert.Equal("servings.piece", patchOp.Path);
//            }).ReturnsAsync(true);

//            var mockApplyUseCase = new Mock<IApplyProductContributionUseCase>();
//            mockApplyUseCase.SetupGet(x => x.HasError).Returns(false);

//            ComponentContext.Setup(x => x.GetService(typeof(IApplyProductContributionUseCase))).Returns(mockApplyUseCase.Object);

//            var useCase = new PatchProductUseCase(UserRepo.Object, ProductRepo.Object, ContributionRepo.Object, ManipulationUtils, ComponentContext.Object,
//                Validator.Object, Grouper, Logger);

//            // act
//            await useCase.Handle(new PatchProductRequest(productId, operations, userId));

//            // assert
//            Assert.False(useCase.HasError);

//            ContributionRepo.Verify(x => x.Add(It.IsAny<ProductContribution>()), Times.Once);
//            ProductRepo.Verify(x => x.FindById(productId), Times.Once);
//            ContributionRepo.VerifyNoOtherCalls();
//            ProductRepo.VerifyNoOtherCalls();
//            mockApplyUseCase.Verify(x => x.Handle(It.IsAny<ApplyProductContributionRequest>()), Times.Once);
//        }

//        [Fact]
//        public async Task TestFailIfProductContributionFails()
//        {
//            // arrange
//            var operations = new List<PatchOperation>
//            {
//                new OpSetProperty("code", JToken.FromObject("123456")), new OpSetProperty("servings.piece", JToken.FromObject(45))
//            };

//            var userId = HasValidUser(true);
//            var productId = HasValidProduct();

//            ContributionRepo.Setup(x => x.Add(It.IsAny<ProductContribution>())).ReturnsAsync(false);

//            var mockApplyUseCase = new Mock<IApplyProductContributionUseCase>();
//            mockApplyUseCase.SetupGet(x => x.HasError).Returns(true);

//            ComponentContext.Setup(x => x.GetService(typeof(IApplyProductContributionUseCase))).Returns(mockApplyUseCase.Object);

//            var useCase = new PatchProductUseCase(UserRepo.Object, ProductRepo.Object, ContributionRepo.Object, ManipulationUtils, ComponentContext.Object,
//                Validator.Object, Grouper, Logger);

//            // act
//            await useCase.Handle(new PatchProductRequest(productId, operations, userId));

//            // assert
//            Assert.True(useCase.HasError);
//            Assert.Equal(ErrorCode.ProductContribution_CreationFailed, (ErrorCode) useCase.Error.Code);

//            ContributionRepo.Verify(x => x.Add(It.IsAny<ProductContribution>()), Times.Once);
//            ProductRepo.Verify(x => x.FindById(productId), Times.Once);
//            ContributionRepo.VerifyNoOtherCalls();
//            ProductRepo.VerifyNoOtherCalls();
//            mockApplyUseCase.Verify(x => x.Handle(It.IsAny<ApplyProductContributionRequest>()), Times.Never);
//        }

//        [Fact]
//        public async Task TestFailIfProductContributionCouldNotBeApplied()
//        {
//            // arrange
//            var operations = new List<PatchOperation>
//            {
//                new OpSetProperty("code", JToken.FromObject("123456")), new OpSetProperty("servings.piece", JToken.FromObject(45))
//            };

//            var userId = HasValidUser(true);
//            var productId = HasValidProduct();

//            ContributionRepo.Setup(x => x.Add(It.IsAny<ProductContribution>())).ReturnsAsync(true);

//            var mockApplyUseCase = new Mock<IApplyProductContributionUseCase>();
//            mockApplyUseCase.SetupGet(x => x.HasError).Returns(true);
//            mockApplyUseCase.SetupGet(x => x.Error).Returns(new Error("test", "test", -1));

//            ComponentContext.Setup(x => x.GetService(typeof(IApplyProductContributionUseCase))).Returns(mockApplyUseCase.Object);

//            var useCase = new PatchProductUseCase(UserRepo.Object, ProductRepo.Object, ContributionRepo.Object, ManipulationUtils, ComponentContext.Object,
//                Validator.Object, Grouper, Logger);

//            // act
//            await useCase.Handle(new PatchProductRequest(productId, operations, userId));

//            // assert
//            Assert.True(useCase.HasError);

//            ContributionRepo.Verify(x => x.Add(It.IsAny<ProductContribution>()), Times.Once);
//            ContributionRepo.Verify(x => x.Remove(It.IsAny<string>()), Times.Once);
//            ProductRepo.Verify(x => x.FindById(productId), Times.Once);
//            ContributionRepo.VerifyNoOtherCalls();
//            ProductRepo.VerifyNoOtherCalls();
//            mockApplyUseCase.Verify(x => x.Handle(It.IsAny<ApplyProductContributionRequest>()), Times.Once);
//        }

//        [Fact]
//        public async Task TestReturnErrorIfPatchesProduceInvalidProduct()
//        {
//            // arrange
//            var useCase = new PatchProductUseCase(UserRepo.Object, ProductRepo.Object, ContributionRepo.Object, ManipulationUtils, ComponentContext.Object,
//                Validator.Object, Grouper, Logger);

//            Validator.Setup(x => x.Validate(It.IsAny<IEnumerable<PatchOperation>>(), It.IsAny<ProductInfo>()))
//                .Returns(new ValidationResult(new[] {new ValidationFailure("", ""),}));

//            var userId = HasValidUser();
//            var productId = HasValidProduct();

//            // act
//            await useCase.Handle(new PatchProductRequest(productId, new[] {new OpSetProperty("defaultServing", JToken.FromObject("asd")),}, userId));

//            // assert
//            Assert.True(useCase.HasError);
//            Assert.Equal(ErrorCode.Product_Validation, (ErrorCode) useCase.Error.Code);

//            ProductRepo.Verify(x => x.FindById(productId), Times.Once);
//            ContributionRepo.VerifyNoOtherCalls();
//            ProductRepo.VerifyNoOtherCalls();
//        }

//        [Fact]
//        public async Task TestAddValidPatch()
//        {
//            // arrange
//            var useCase = new PatchProductUseCase(UserRepo.Object, ProductRepo.Object, ContributionRepo.Object, ManipulationUtils, ComponentContext.Object,
//                Validator.Object, Grouper, Logger);

//            Validator.Setup(x => x.Validate(It.IsAny<IEnumerable<PatchOperation>>(), It.IsAny<ProductInfo>())).Returns(new ValidationResult());
//            ContributionRepo.Setup(x => x.Add(It.IsAny<ProductContribution>())).ReturnsAsync(true);

//            var userId = HasValidUser();
//            var productId = HasValidProduct();

//            // act
//            await useCase.Handle(new PatchProductRequest(productId, new[] { new OpSetProperty("defaultServing", JToken.FromObject("asd")), }, userId));

//            // assert
//            Assert.False(useCase.HasError);

//            ProductRepo.Verify(x => x.FindById(productId), Times.Once);
//            ContributionRepo.Verify(x => x.Add(It.IsAny<ProductContribution>()), Times.Once);
//            ContributionRepo.VerifyNoOtherCalls();
//            ProductRepo.VerifyNoOtherCalls();
//        }

//        [Fact]
//        public async Task TestVoteForDuplicateContribution()
//        {
//            // arrange
//            var useCase = new PatchProductUseCase(UserRepo.Object, ProductRepo.Object, ContributionRepo.Object, ManipulationUtils, ComponentContext.Object,
//                Validator.Object, Grouper, Logger);

//            Validator.Setup(x => x.Validate(It.IsAny<IEnumerable<PatchOperation>>(), It.IsAny<ProductInfo>())).Returns(new ValidationResult());
//            ContributionRepo.Setup(x => x.Add(It.IsAny<ProductContribution>())).ReturnsAsync(false);

//            var userId = HasValidUser();
//            var productId = HasValidProduct();

//            ContributionRepo.Setup(x => x.FindByPatchHash(productId, It.IsAny<string>()))
//                .ReturnsAsync(new ProductContribution("A", productId, GetValidPatchOperations()));

//            var mockApplyUseCase = new Mock<IVoteProductContributionUseCase>();
//            mockApplyUseCase.SetupGet(x => x.HasError).Returns(false);

//            ComponentContext.Setup(x => x.GetService(typeof(IVoteProductContributionUseCase))).Returns(mockApplyUseCase.Object);

//            // act
//            await useCase.Handle(new PatchProductRequest(productId, new[] { new OpSetProperty("defaultServing", JToken.FromObject("asd")), }, userId));

//            // assert
//            Assert.False(useCase.HasError);

//            ProductRepo.Verify(x => x.FindById(productId), Times.Once);
//            mockApplyUseCase.Verify(x => x.Handle(It.IsAny<VoteProductContributionRequest>()), Times.Once);
//            ContributionRepo.Verify(x => x.FindByPatchHash(It.IsAny<string>(), It.IsAny<string>()), Times.Once);
//            ContributionRepo.Verify(x => x.Add(It.IsAny<ProductContribution>()), Times.Once);
//            ContributionRepo.VerifyNoOtherCalls();
//            ProductRepo.VerifyNoOtherCalls();
//        }
//    }
//}
