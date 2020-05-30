using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Utilities;
using Xunit;

namespace MyNutritionComrade.Core.Tests.Utilities
{
    public class NutritionalInfoUtilsTests
    {
        [Fact]
        public void TestSumNutrition()
        {
            var n1 = new NutritionalInfo(100, 20, 7, 5, 10, 5, 20, 1, 0.5);
            var n2 = new NutritionalInfo(120, 11, 3, 2, 30, 5, 31, 1, 0.1);

            var result = new[] { n1, n2 }.SumNutrition();

            Assert.Equal(220, result.Volume);
            Assert.Equal(31, result.Energy);
            Assert.Equal(10, result.Fat);
            Assert.Equal(7, result.SaturatedFat);
            Assert.Equal(40, result.Carbohydrates);
            Assert.Equal(10, result.Sugars);
            Assert.Equal(51, result.Protein);
            Assert.Equal(2, result.DietaryFiber);
            Assert.Equal(0.6, result.Sodium);
        }

        [Fact]
        public void TestChangeVolume()
        {
            var info = new NutritionalInfo(100, 20, 7, 5, 10, 5, 20, 1, 0.5);

            var result = info.ChangeVolume(200);

            Assert.Equal(200, result.Volume);
            Assert.Equal(40, result.Energy);
            Assert.Equal(14, result.Fat);
            Assert.Equal(10, result.SaturatedFat);
            Assert.Equal(20, result.Carbohydrates);
            Assert.Equal(10, result.Sugars);
            Assert.Equal(40, result.Protein);
            Assert.Equal(2, result.DietaryFiber);
            Assert.Equal(1, result.Sodium);
        }
    }
}
