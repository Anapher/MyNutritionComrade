using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Extensions;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Core.UseCases;
using MyNutritionComrade.Infrastructure.Patch;
using Newtonsoft.Json.Linq;
using Xunit;

namespace MyNutritionComrade.Core.Tests.UseCases
{
    public class ApplyProductContributionUseCaseTests
    {
        protected readonly Mock<IProductRepository> MockProductRepo = new Mock<IProductRepository>();
        protected readonly Mock<IProductContributionRepository> MockContributionRepo = new Mock<IProductContributionRepository>();
        protected readonly IObjectManipulationUtils ManipulationUtils = new ManipulationUtils();
        protected readonly Mock<IProductPatchValidator> MockValidator = new Mock<IProductPatchValidator>();
        protected readonly ILogger<ApplyProductContributionUseCase> Logger = new NullLogger<ApplyProductContributionUseCase>();

        private Product GetValidProduct()
        {
            var p = new Product("1") {DefaultServing = ServingType.Gram, NutritionalInfo = new NutritionalInfo(100, 244, 0, 0, 0, 0, 0, 0, 0)};
            p.AddProductLabel("Haferflocken", "de");
            p.AddProductServing(ServingType.Gram, 1);
            return p;
        }

        private IReadOnlyList<PatchOperation> GetValidPatchOperations() =>
            new List<PatchOperation> {new OpSetProperty("code", JToken.FromObject("123456")), new OpSetProperty("servings.piece", JToken.FromObject(45))};

        [Fact]
        public async Task TestApplyContributionThatIsAlreadyApplied()
        {
            // arrange
            var useCase = new ApplyProductContributionUseCase(MockProductRepo.Object, MockContributionRepo.Object, ManipulationUtils, MockValidator.Object,
                Logger);

            var product = GetValidProduct();
            var operations = GetValidPatchOperations();
            var contribution = new ProductContribution("123", "1", operations);
            contribution.Apply(1);

            // act
            await useCase.Handle(new ApplyProductContributionRequest(contribution, product));

            // assert
            Assert.True(useCase.HasError);
            Assert.Equal(ErrorCode.ProductContribution_InvalidStatus, (ErrorCode) useCase.Error.Code);
        }

        [Fact]
        public async Task TestApplyContributionThatWasRejected()
        {
            // arrange
            var useCase = new ApplyProductContributionUseCase(MockProductRepo.Object, MockContributionRepo.Object, ManipulationUtils, MockValidator.Object,
                Logger);

            var product = GetValidProduct();
            var operations = GetValidPatchOperations();
            var contribution = new ProductContribution("123", "1", operations);
            contribution.Reject();

            // act
            await useCase.Handle(new ApplyProductContributionRequest(contribution, product));

            // assert
            Assert.True(useCase.HasError);
            Assert.Equal(ErrorCode.ProductContribution_InvalidStatus, (ErrorCode)useCase.Error.Code);
        }

        [Fact]
        public async Task TestApplyingPatchThrowsError()
        {
            // arrange
            var product = GetValidProduct();
            var contribution = new ProductContribution("123", "1", GetValidPatchOperations());

            var mockManipulationUtils = new Mock<IObjectManipulationUtils>();
            mockManipulationUtils.Setup(x => x.ExecutePatch(contribution.Patch, product)).Throws(new Exception("Patch failed"));

            var useCase = new ApplyProductContributionUseCase(MockProductRepo.Object, MockContributionRepo.Object, mockManipulationUtils.Object,
                MockValidator.Object, Logger);

            // act
            await useCase.Handle(new ApplyProductContributionRequest(contribution, product));

            // assert
            Assert.True(useCase.HasError);
            Assert.Equal(ErrorCode.ProductContribution_PatchExecutionFailed, (ErrorCode) useCase.Error.Code);
        }

        [Fact]
        public async Task TestPatchProducesInvalidProduct()
        {
            // arrange
            var useCase = new ApplyProductContributionUseCase(MockProductRepo.Object, MockContributionRepo.Object, ManipulationUtils, MockValidator.Object,
                Logger);

            var product = GetValidProduct();
            var operations = new[] {new OpSetProperty("defaultServing", JToken.FromObject("piece")),};
            var contribution = new ProductContribution("123", "1", operations);

            // act
            await useCase.Handle(new ApplyProductContributionRequest(contribution, product));

            // assert
            Assert.True(useCase.HasError);
            Assert.Equal(ErrorCode.ProductContribution_PatchExecutionFailed, (ErrorCode)useCase.Error.Code);
        }

        [Fact]
        public async Task TestDontWriteChanges()
        {
            // arrange
            var useCase = new ApplyProductContributionUseCase(MockProductRepo.Object, MockContributionRepo.Object, ManipulationUtils, MockValidator.Object,
                Logger);

            var product = GetValidProduct();
            product.Version = 5;
            var operations = GetValidPatchOperations();
            var contribution = new ProductContribution("123", "1", operations);

            // act
            var response = await useCase.Handle(new ApplyProductContributionRequest(contribution, product, "test", false));

            // assert
            Assert.False(useCase.HasError);
            Assert.Equal(product, response.Product);
            Assert.Equal(contribution, response.ProductContribution);

            Assert.Equal(ProductContributionStatus.Applied, contribution.Status);
            Assert.Equal(product.Version, contribution.AppliedVersion);
            Assert.Equal("test", contribution.StatusDescription);
            Assert.Equal(6, product.Version);
            Assert.Equal("123456", product.Code);
            Assert.Equal(45, product.Servings[ServingType.Piece]);

            MockProductRepo.VerifyNoOtherCalls();
            MockContributionRepo.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestWriteChangesFails()
        {
            // arrange
            var useCase = new ApplyProductContributionUseCase(MockProductRepo.Object, MockContributionRepo.Object, ManipulationUtils, MockValidator.Object,
                Logger);

            var product = GetValidProduct();
            product.Version = 5;
            var operations = GetValidPatchOperations();
            var contribution = new ProductContribution("123", "1", operations);

            MockProductRepo.Setup(x => x.SaveProductChanges(product, It.IsAny<int>(), contribution)).Callback(
                (Product p, int sourceVersion, ProductContribution c) =>
                {
                    Assert.Equal(5, sourceVersion);

                    Assert.Equal(ProductContributionStatus.Applied, c.Status);
                    Assert.Equal(product.Version, c.AppliedVersion);
                    Assert.Equal("test", c.StatusDescription);
                    Assert.Equal(6, p.Version);
                    Assert.Equal("123456", p.Code);
                    Assert.Equal(45, p.Servings[ServingType.Piece]);
                }).ReturnsAsync(false);

            // act
            await useCase.Handle(new ApplyProductContributionRequest(contribution, product, "test"));

            // assert
            Assert.True(useCase.HasError);
            Assert.Equal(ErrorCode.Product_ExecutionRaceCondition, (ErrorCode) useCase.Error.Code);

            MockProductRepo.Verify(x => x.SaveProductChanges(product, It.IsAny<int>(), contribution), Times.Once);

            MockProductRepo.VerifyNoOtherCalls();
            MockContributionRepo.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestWriteChanges()
        {
            // arrange
            var useCase = new ApplyProductContributionUseCase(MockProductRepo.Object, MockContributionRepo.Object, ManipulationUtils, MockValidator.Object,
                Logger);

            var product = GetValidProduct();
            product.Version = 5;
            var operations = GetValidPatchOperations();
            var contribution = new ProductContribution("123", "1", operations);

            MockProductRepo.Setup(x => x.SaveProductChanges(product, It.IsAny<int>(), contribution)).ReturnsAsync(true);
            MockContributionRepo.Setup(x => x.GetActiveProductContributions("1")).ReturnsAsync(new List<ProductContribution>());

            // act
            var response = await useCase.Handle(new ApplyProductContributionRequest(contribution, product, "test"));

            // assert
            Assert.False(useCase.HasError);
            Assert.Equal(product, response.Product);
            Assert.Equal(contribution, response.ProductContribution);

            MockProductRepo.Verify(x => x.SaveProductChanges(product, It.IsAny<int>(), contribution), Times.Once);
            MockContributionRepo.Verify(x => x.GetActiveProductContributions("1"), Times.Once);

            MockProductRepo.VerifyNoOtherCalls();
            MockContributionRepo.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestWriteChangesRejectInvalidOtherContributions()
        {
            // arrange
            var useCase = new ApplyProductContributionUseCase(MockProductRepo.Object, MockContributionRepo.Object, ManipulationUtils, MockValidator.Object,
                Logger);

            var product = GetValidProduct();
            product.Version = 5;
            var operations = GetValidPatchOperations();
            var contribution = new ProductContribution("123", "1", operations);

            MockProductRepo.Setup(x => x.SaveProductChanges(product, It.IsAny<int>(), contribution)).ReturnsAsync(true);
            MockContributionRepo.Setup(x => x.GetActiveProductContributions("1")).ReturnsAsync(new List<ProductContribution>
            {
                new ProductContribution("143", "1", new List<PatchOperation> {new OpSetProperty("code", JToken.FromObject("123456"))})
            });
            MockContributionRepo.Setup(x => x.UpdateProductContribution(It.IsAny<ProductContribution>())).Callback((ProductContribution p) =>
            {
                Assert.Equal(ProductContributionStatus.Rejected, p.Status);
            }).ReturnsAsync(true);

            MockValidator.Setup(x => x.Validate(It.IsAny<IEnumerable<PatchOperation>>(), It.IsAny<ProductInfo>()))
                .Returns(new ValidationResult(new ValidationFailure("", "").Yield()));

            // act
            var response = await useCase.Handle(new ApplyProductContributionRequest(contribution, product, "test"));

            // assert
            Assert.False(useCase.HasError);
            Assert.Equal(product, response.Product);
            Assert.Equal(contribution, response.ProductContribution);

            MockProductRepo.Verify(x => x.SaveProductChanges(product, It.IsAny<int>(), contribution), Times.Once);
            MockContributionRepo.Verify(x => x.GetActiveProductContributions("1"), Times.Once);
            MockContributionRepo.Verify(x => x.UpdateProductContribution(It.IsAny<ProductContribution>()), Times.Once);

            MockProductRepo.VerifyNoOtherCalls();
            MockContributionRepo.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestWriteChangesRejectInvalidOtherContributionsIgnoreErrors()
        {
            // arrange
            var useCase = new ApplyProductContributionUseCase(MockProductRepo.Object, MockContributionRepo.Object, ManipulationUtils, MockValidator.Object,
                Logger);

            var product = GetValidProduct();
            product.Version = 5;
            var operations = GetValidPatchOperations();
            var contribution = new ProductContribution("123", "1", operations);

            MockProductRepo.Setup(x => x.SaveProductChanges(product, It.IsAny<int>(), contribution)).ReturnsAsync(true);
            MockContributionRepo.Setup(x => x.GetActiveProductContributions("1")).ReturnsAsync(new List<ProductContribution>
            {
                new ProductContribution("143", "1", new List<PatchOperation> {new OpSetProperty("code", JToken.FromObject("123456"))})
            });
            MockContributionRepo.Setup(x => x.UpdateProductContribution(It.IsAny<ProductContribution>())).Callback((ProductContribution p) =>
            {
                Assert.Equal(ProductContributionStatus.Rejected, p.Status);
            }).ReturnsAsync(false);

            MockValidator.Setup(x => x.Validate(It.IsAny<IEnumerable<PatchOperation>>(), It.IsAny<ProductInfo>()))
                .Returns(new ValidationResult(new ValidationFailure("", "").Yield()));

            // act
            var response = await useCase.Handle(new ApplyProductContributionRequest(contribution, product, "test"));

            // assert
            Assert.False(useCase.HasError);
            Assert.Equal(product, response.Product);
            Assert.Equal(contribution, response.ProductContribution);

            MockProductRepo.Verify(x => x.SaveProductChanges(product, It.IsAny<int>(), contribution), Times.Once);
            MockContributionRepo.Verify(x => x.GetActiveProductContributions("1"), Times.Once);
            MockContributionRepo.Verify(x => x.UpdateProductContribution(It.IsAny<ProductContribution>()), Times.Once);

            MockProductRepo.VerifyNoOtherCalls();
            MockContributionRepo.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestWriteDontRejectValidContributions()
        {
            // arrange
            var useCase = new ApplyProductContributionUseCase(MockProductRepo.Object, MockContributionRepo.Object, ManipulationUtils, MockValidator.Object,
                Logger);

            var product = GetValidProduct();
            product.Version = 5;
            var operations = GetValidPatchOperations();
            var contribution = new ProductContribution("123", "1", operations);

            MockProductRepo.Setup(x => x.SaveProductChanges(product, It.IsAny<int>(), contribution)).ReturnsAsync(true);
            MockContributionRepo.Setup(x => x.GetActiveProductContributions("1")).ReturnsAsync(new List<ProductContribution>
            {
                new ProductContribution("143", "1", new List<PatchOperation> {new OpSetProperty("code", JToken.FromObject("123456"))})
            });

            MockValidator.Setup(x => x.Validate(It.IsAny<IEnumerable<PatchOperation>>(), It.IsAny<ProductInfo>()))
                .Returns(new ValidationResult());

            // act
            var response = await useCase.Handle(new ApplyProductContributionRequest(contribution, product, "test"));

            // assert
            Assert.False(useCase.HasError);
            Assert.Equal(product, response.Product);
            Assert.Equal(contribution, response.ProductContribution);

            MockProductRepo.Verify(x => x.SaveProductChanges(product, It.IsAny<int>(), contribution), Times.Once);
            MockContributionRepo.Verify(x => x.GetActiveProductContributions("1"), Times.Once);

            MockProductRepo.VerifyNoOtherCalls();
            MockContributionRepo.VerifyNoOtherCalls();
        }
    }
}
