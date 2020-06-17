using System.Collections.Generic;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Infrastructure.Patch;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using Xunit;

namespace MyNutritionComrade.Infrastructure.Tests.Patch
{
    public class PatchExecutorTests
    {
        private static readonly JsonSerializer Serializer = new JsonSerializer { ContractResolver = new CamelCasePropertyNamesContractResolver() };
        private static JToken CreateToken(object obj) => JToken.FromObject(obj, Serializer);

        private class TestClassList
        {
            public List<ProductLabel> Label { get; set; } = new List<ProductLabel>();
        }

        [Fact]
        public void TestSetProperty()
        {
            var product = new ProductInfo();
            var operations = new PatchOperation[] {new OpSetProperty("code", CreateToken("123456"))};

            PatchExecutor.Execute(operations, product);

            Assert.Equal("123456", product.Code);
        }

        [Fact]
        public void TestSetDeepProperty()
        {
            var product = new ProductInfo();
            var operations = new PatchOperation[] { new OpSetProperty("nutritionalInfo.protein", CreateToken(23)) };

            PatchExecutor.Execute(operations, product);

            Assert.Equal(23, product.NutritionalInfo.Protein);
        }

        [Fact]
        public void TestSetDictProperty()
        {
            var product = new ProductInfo();
            var operations = new PatchOperation[] { new OpSetProperty("servings.piece", CreateToken(60)) };

            PatchExecutor.Execute(operations, product);

            Assert.Equal(60, product.Servings[ServingType.Piece]);
        }

        [Fact]
        public void TestUnsetProperty()
        {
            var product = new ProductInfo {Code = "hallo welt"};
            var operations = new PatchOperation[] { new OpUnsetProperty("code"), };

            PatchExecutor.Execute(operations, product);

            Assert.Null(product.Code);
        }

        [Fact]
        public void TestUnsetDeepProperty()
        {
            var product = new ProductInfo {NutritionalInfo = new NutritionalInfo(100, 244, 10, 4, 60, 4, 12, 1, 0.1)};
            var operations = new PatchOperation[] { new OpUnsetProperty("nutritionalInfo.protein"),  };

            PatchExecutor.Execute(operations, product);

            Assert.Equal(0, product.NutritionalInfo.Protein);
        }

        [Fact]
        public void TestUnsetDictProperty()
        {
            var product = new ProductInfo();
            product.AddProductServing(ServingType.Piece, 60);
            var operations = new PatchOperation[] {new OpUnsetProperty("servings.piece"),};

            PatchExecutor.Execute(operations, product);

            Assert.Empty(product.Servings);
        }

        [Fact]
        public void TestAddItem()
        {
            var product = new TestClassList();
            var operations = new PatchOperation[] {new OpAddItem("label", JToken.FromObject(new ProductLabel("Haferflocken"))),};

            PatchExecutor.Execute(operations, product);

            var label = Assert.Single(product.Label);
            Assert.Equal("Haferflocken", label.Value);
        }

        [Fact]
        public void TestRemoveItem()
        {
            var product = new TestClassList();
            product.Label.Add(new ProductLabel("Haferflocken"));
            var operations = new PatchOperation[] { new OpRemoveItem("label", CreateToken(new ProductLabel("Haferflocken"))), };

            PatchExecutor.Execute(operations, product);

            Assert.Empty(product.Label);
        }

        [Fact]
        public void TestAddItemToSet()
        {
            var product = new ProductInfo();
            var operations = new PatchOperation[] { new OpAddItem("tags", CreateToken("testtag")) };

            PatchExecutor.Execute(operations, product);

            var tag = Assert.Single(product.Tags);
            Assert.Equal("testtag", tag);
        }

        [Fact]
        public void TestRemoveItemFromSet()
        {
            var product = new ProductInfo();
            product.Tags.Add("testtag");

            var operations = new PatchOperation[] { new OpRemoveItem("tags", CreateToken("testtag")) };

            PatchExecutor.Execute(operations, product);

            Assert.Empty(product.Tags);
        }
    }
}
