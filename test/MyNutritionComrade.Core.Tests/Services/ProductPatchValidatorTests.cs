using System.Collections.Generic;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Core.Services;
using Xunit;

namespace MyNutritionComrade.Core.Tests.Services
{
    public class ProductPatchValidatorTests
    {
        [Fact]
        public void TestValidPatch()
        {
            // arrange
            var productInfo = new ProductInfo {DefaultServing = ServingType.Gram, NutritionalInfo = new NutritionalInfo(100, 244, 0, 0, 0, 0, 0, 0, 0)};
            productInfo.AddProductLabel("Haferflocken", "de");
            productInfo.AddProductServing(ServingType.Gram, 1);

            var mockPatchFactory = new Mock<IObjectManipulationUtils>();
            mockPatchFactory.Setup(x => x.Clone(productInfo)).Returns(productInfo);
            mockPatchFactory.Setup(x => x.Compare(productInfo, productInfo)).Returns(false);

            var validator = new ProductPatchValidator(mockPatchFactory.Object, new NullLogger<ProductPatchValidator>());

            // act
            var result = validator.Validate(new List<PatchOperation>(), productInfo);

            // assert
            Assert.True(result.IsValid);
        }

        [Fact]
        public void TestInvalidPatch()
        {
            // arrange
            var productInfo = new ProductInfo { DefaultServing = ServingType.Gram, NutritionalInfo = new NutritionalInfo(100, 244, 0, 0, 0, 0, 0, 0, 0) };
            productInfo.AddProductLabel("Haferflocken", "de");

            var mockPatchFactory = new Mock<IObjectManipulationUtils>();
            mockPatchFactory.Setup(x => x.Clone(productInfo)).Returns(productInfo);
            mockPatchFactory.Setup(x => x.Compare(productInfo, productInfo)).Returns(false);

            var validator = new ProductPatchValidator(mockPatchFactory.Object, new NullLogger<ProductPatchValidator>());

            // act
            var result = validator.Validate(new List<PatchOperation>(), productInfo);

            // assert
            Assert.False(result.IsValid);
        }

        [Fact]
        public void TestPatchNoChanges()
        {
            // arrange
            var productInfo = new ProductInfo { DefaultServing = ServingType.Gram, NutritionalInfo = new NutritionalInfo(100, 244, 0, 0, 0, 0, 0, 0, 0) };
            productInfo.AddProductLabel("Haferflocken", "de");
            productInfo.AddProductServing(ServingType.Gram, 1);

            var mockPatchFactory = new Mock<IObjectManipulationUtils>();
            mockPatchFactory.Setup(x => x.Clone(productInfo)).Returns(productInfo);
            mockPatchFactory.Setup(x => x.Compare(productInfo, productInfo)).Returns(true);

            var validator = new ProductPatchValidator(mockPatchFactory.Object, new NullLogger<ProductPatchValidator>());

            // act
            var result = validator.Validate(new List<PatchOperation>(), productInfo);

            // assert
            Assert.False(result.IsValid);
        }
    }
}
