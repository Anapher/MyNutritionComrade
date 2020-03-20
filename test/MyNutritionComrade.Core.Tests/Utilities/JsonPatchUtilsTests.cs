using System.Collections.Generic;
using Microsoft.AspNetCore.JsonPatch.Operations;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Utilities;
using Newtonsoft.Json;
using Xunit;

namespace MyNutritionComrade.Core.Tests.Utilities
{
    public class JsonPatchUtilsTests
    {
        private readonly JsonPatchUtils _utils = new JsonPatchUtils();

        [Fact]
        public void TestCreateJsonPatchDocumentSmallModification()
        {
            var originalProduct = new NutritionInformation(100, 200, 15, 2, 5, 6, 20, 4, 1.2);
            var updatedProduct = new NutritionInformation(100, 200, 15, 2, 5, 6, 21, 4, 1.2);

            var result = _utils.CreatePatch(originalProduct, updatedProduct);
            var op = Assert.Single(result.Operations);
            Assert.Equal("/Protein", op.path);
            Assert.Equal(OperationType.Replace, op.OperationType);
            Assert.Equal("21.0", JsonConvert.SerializeObject(op.value));
        }

        [Fact]
        public void TestCreateJsonPatchDocumentNoChanges()
        {
            var originalProduct = new NutritionInformation(100, 200, 15, 2, 5, 6, 20, 4, 1.2);
            var originalProduct2 = new NutritionInformation(100, 200, 15, 2, 5, 6, 20, 4, 1.2);

            var result = _utils.CreatePatch(originalProduct, originalProduct2);
            Assert.Empty(result.Operations);
        }

        [Fact]
        public void TestCreateJsonPatchDocumentDeepChanges()
        {
            var nutritionInfo1 = new NutritionInformation(100, 200, 15, 2, 5, 6, 20, 4, 1.2);
            var nutritionInfo2 = new NutritionInformation(100, 200, 20, 2, 5, 6, 20, 4, 1.2);

            var originalProduct = new ProductDto(nutritionInfo1, "TestCode", new List<ProductLabelDto> {new ProductLabelDto("Name", "en")},
                new List<ProductServingDto> {new ProductServingDto(100d, "gram", new[] {new ProductServingLabelDto("gram", "en", "grams")})}, "gram");
            var updatedProduct = new ProductDto(nutritionInfo2, "TestCode", new List<ProductLabelDto> { new ProductLabelDto("Name", "en") },
                new List<ProductServingDto> { new ProductServingDto(100d, "gram", new[] { new ProductServingLabelDto("gram", "en", "grams") }) }, "gram");


            var result = _utils.CreatePatch(originalProduct, updatedProduct);
            var op = Assert.Single(result.Operations);
            Assert.Equal("/NutritionInformation/Fat", op.path);
            Assert.Equal(OperationType.Replace, op.OperationType);
            Assert.Equal("20.0", JsonConvert.SerializeObject(op.value));
        }

        [Fact]
        public void TestCreateJsonPatchDocumentListChanges()
        {
            var originalProduct = new ProductDto(NutritionInformation.Empty, "TestCode", new List<ProductLabelDto> { new ProductLabelDto("Name", "en") },
                new List<ProductServingDto> { new ProductServingDto(100d, "gram", new[] { new ProductServingLabelDto("gram", "en", "grams") }) }, "gram");
            var updatedProduct = new ProductDto(NutritionInformation.Empty, "TestCode", new List<ProductLabelDto> { new ProductLabelDto("Name", "en"), new ProductLabelDto("Name", "de") },
                new List<ProductServingDto> { new ProductServingDto(100d, "gram", new[] { new ProductServingLabelDto("gram", "en", "grams") }) }, "gram");


            var result = _utils.CreatePatch(originalProduct, updatedProduct);
            var op = Assert.Single(result.Operations);
            Assert.Equal(OperationType.Add, op.OperationType);
            Assert.Equal("/Label", op.path);
            var asd = JsonConvert.SerializeObject(op.value);
            Assert.Equal(@"{}", JsonConvert.SerializeObject(op.value));
        }
    }
}
