using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Utilities;
using Xunit;

namespace MyNutritionComrade.Core.Tests.Utilities
{
    public class ProductValueUtilsTests
    {
        [Fact]
        public void TestCreateJsonPatchDocument()
        {
            var originalProduct = new ProductValue(new NutritionInformation(100, 200, 15, 2, 5, 6, 20, 4, 1.2), "ABC");
            var updatedProduct = new ProductValue(new NutritionInformation(100, 200, 15, 2, 5, 6, 21, 4, 1.2), "ABC");

            var result = ProductValueUtils.CreateJsonPatchDocument(originalProduct, updatedProduct);
            Assert.Equal(@"[{""value"":20.0,""path"":""/NutritionInformation/Protein"",""op"":""replace""}]", result);
        }

        [Fact]
        public void TestCreateJsonPatchDocument2()
        {
            var originalProduct = new ProductValue(new NutritionInformation(100, 200, 15, 2, 5, 6, 20, 4, 1.2), "ABC");
            var updatedProduct = new ProductValue(new NutritionInformation(100, 200, 15, 2, 5, 6, 20, 4, 1.2), "CBA");

            var result = ProductValueUtils.CreateJsonPatchDocument(originalProduct, updatedProduct);
            Assert.Equal(@"[{""value"":""ABC"",""path"":""/Code"",""op"":""replace""}]", result);
        }
    }
}
