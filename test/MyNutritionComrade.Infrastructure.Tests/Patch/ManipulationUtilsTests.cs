using System;
using System.Collections.Generic;
using System.Text;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Infrastructure.Patch;
using Xunit;

namespace MyNutritionComrade.Infrastructure.Tests.Patch
{
    public class ManipulationUtilsTests
    {
        // CreatePatch() and ExecutePatch() are just delegates, no need to test them
        protected IObjectManipulationUtils Utils = new ManipulationUtils();

        [Fact]
        public void TestCopy()
        {
            var obj = "Hello World";
            var result = Utils.Clone(obj);
            Assert.Equal(obj, result);
        }

        [Fact]
        public void TestCopyProduct()
        {
            var product = new ProductInfo();
            product.Code = "123456";
            product.NutritionalInfo = new NutritionalInfo(100, 244, 0, 0, 0, 0, 0, 0, 0);
            product.Label.Add("de", new ProductLabel("Haferflocken"));
            product.DefaultServing = ServingType.Gram;

            var cloned = Utils.Clone(product);
            Assert.NotSame(product, cloned);

            Assert.Equal("123456", cloned.Code);
            Assert.Equal("Haferflocken", Assert.Single(cloned.Label).Value.Value);
            Assert.Equal(ServingType.Gram, cloned.DefaultServing);
            Assert.Equal(244, cloned.NutritionalInfo.Energy);
        }

        [Fact]
        public void TestCompareEqualProducts()
        {
            var product = new ProductInfo();
            product.Code = "123456";
            product.NutritionalInfo = new NutritionalInfo(100, 244, 0, 0, 0, 0, 0, 0, 0);
            product.Label.Add("de", new ProductLabel("Haferflocken"));
            product.DefaultServing = ServingType.Gram;

            var product2 = new ProductInfo();
            product2.Code = "123456";
            product2.NutritionalInfo = new NutritionalInfo(100, 244, 0, 0, 0, 0, 0, 0, 0);
            product2.Label.Add("de", new ProductLabel("Haferflocken"));
            product2.DefaultServing = ServingType.Gram;

            Assert.True(Utils.Compare(product, product2));
        }

        [Fact]
        public void TestCompareUnequalProducts()
        {
            var product = new ProductInfo();
            product.Code = "123456";
            product.NutritionalInfo = new NutritionalInfo(100, 244, 0, 0, 0, 0, 0, 0, 0);
            product.Label.Add("en", new ProductLabel("Haferflocken"));
            product.DefaultServing = ServingType.Gram;

            var product2 = new ProductInfo();
            product2.Code = "123456";
            product2.NutritionalInfo = new NutritionalInfo(100, 244, 0, 0, 0, 0, 0, 0, 0);
            product2.Label.Add("de", new ProductLabel("Haferflocken"));
            product2.DefaultServing = ServingType.Gram;

            Assert.False(Utils.Compare(product, product2));
        }

        [Fact]
        public void TestCompareEqualProductToProductInfo()
        {
            var product = new Product("123456");
            product.Code = "123456";
            product.NutritionalInfo = new NutritionalInfo(100, 244, 0, 0, 0, 0, 0, 0, 0);
            product.Label.Add("de", new ProductLabel("Haferflocken"));
            product.DefaultServing = ServingType.Gram;

            var product2 = new ProductInfo();
            product2.Code = "123456";
            product2.NutritionalInfo = new NutritionalInfo(100, 244, 0, 0, 0, 0, 0, 0, 0);
            product2.Label.Add("de", new ProductLabel("Haferflocken"));
            product2.DefaultServing = ServingType.Gram;

            Assert.True(Utils.Compare(product, product2));
        }
    }
}
