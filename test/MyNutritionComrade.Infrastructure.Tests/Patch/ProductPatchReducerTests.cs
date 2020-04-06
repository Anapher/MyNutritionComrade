using System.Linq;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Utilities;
using MyNutritionComrade.Infrastructure.Extensions;
using MyNutritionComrade.Infrastructure.Patch;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using Xunit;

namespace MyNutritionComrade.Infrastructure.Tests.Patch
{
    public class ProductPatchReducerTests
    {
        private static readonly JsonSerializer Serializer = new JsonSerializer {ContractResolver = new CamelCasePropertyNamesContractResolver()};
        private static JToken CreateToken(object obj) => JToken.FromObject(obj, Serializer);

        [Fact]
        public void TestDoNotReduceLabelsWithDifferentLanguages()
        {
            var patch = new PatchOperation[]
            {
                new OpAddItem("label", CreateToken(new ProductLabel("Hallo Welt", "de"))),
                new OpRemoveItem("label", CreateToken(new ProductLabel("Hallo Wetl", "en"))), new OpSetProperty("code", CreateToken("123456"))
            };

            var reduced = ProductPatchReducer.ReducePatch(patch).ToList();

            Assert.Equal(3, reduced.Count);
            foreach (var ops in reduced)
                Assert.Single(ops);
        }

        [Fact]
        public void TestReduceChangesToLiquidState()
        {
            var patch = new PatchOperation[]
            {
                new OpAddItem("tags", CreateToken(ProductInfo.TagLiquid)), new OpUnsetProperty("servings.g"),
                new OpSetProperty("servings.ml", CreateToken(1)), new OpSetProperty("code", CreateToken("123456"))
            };

            var reduced = ProductPatchReducer.ReducePatch(patch).ToList();

            Assert.Collection(reduced.OrderBy(x => x.Length), operations => Assert.Single(operations),
                operations => Assert.True(operations.ScrambledEquals(patch.Where(x => x.Path != "code"))));
        }

        [Fact]
        public void TestReduceChangesToLiquidState2()
        {
            var patch = new PatchOperation[]
            {
                new OpAddItem("tags", CreateToken(ProductInfo.TagLiquid)), new OpUnsetProperty("servings.g"),
                new OpSetProperty("servings.ml", CreateToken(1)), new OpSetProperty("defaultServing", "ml"),
                new OpSetProperty("code", CreateToken("123456"))
            };

            var reduced = ProductPatchReducer.ReducePatch(patch).ToList();

            Assert.Collection(reduced.OrderBy(x => x.Length), operations => Assert.Single(operations),
                operations => Assert.True(operations.ScrambledEquals(patch.Where(x => x.Path != "code"))));
        }

        [Fact]
        public void TestReduceChangesToNutritionalInfo()
        {
            var patch = new PatchOperation[] {new OpSetProperty("nutritionalInfo.energy", CreateToken(500)), new OpSetProperty("code", CreateToken("123456"))};

            var reduced = ProductPatchReducer.ReducePatch(patch).ToList();

            Assert.Collection(reduced.OrderBy(x => x.First().Path), operations => Assert.Single(operations),
                operations => Assert.True(operations.ScrambledEquals(patch.Where(x => x.Path != "code"))));
        }

        [Fact]
        public void TestReduceChangesToNutritionalInfo2()
        {
            var patch = new PatchOperation[]
            {
                new OpSetProperty("nutritionalInfo.energy", CreateToken(500)), new OpSetProperty("nutritionalInfo.protein", CreateToken(23)),
                new OpSetProperty("code", CreateToken("123456"))
            };

            var reduced = ProductPatchReducer.ReducePatch(patch).ToList();

            Assert.Collection(reduced.OrderBy(x => x.First().Path), operations => Assert.Single(operations),
                operations => Assert.True(operations.ScrambledEquals(patch.Where(x => x.Path != "code"))));
        }

        [Fact]
        public void TestReduceReplacedLabels()
        {
            var patch = new PatchOperation[]
            {
                new OpAddItem("label", CreateToken(new ProductLabel("Hallo Welt", "de"))),
                new OpRemoveItem("label", CreateToken(new ProductLabel("Hallo Wetl", "de"))), new OpSetProperty("code", CreateToken("123456"))
            };

            var reduced = ProductPatchReducer.ReducePatch(patch);

            Assert.Collection(reduced.OrderBy(x => x.Length), operations => Assert.Equal(patch.First(x => x.Path == "code"), Assert.Single(operations)),
                operations => Assert.True(operations.ScrambledEquals(patch.Where(x => x.Path != "code"))));
        }
    }
}
