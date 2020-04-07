using System;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Services;
using MyNutritionComrade.Infrastructure.Patch;
using Newtonsoft.Json;
using Xunit;

namespace MyNutritionComrade.Infrastructure.Tests.Patch
{
    public class PatchCreatorTests
    {
        private static ProductInfo GetEmptyProduct(Action<ProductInfo> configure = null)
        {
            var product = new ProductInfo();
            product.AddProductServing(ServingType.Gram, 1);
            configure?.Invoke(product);
            return product;
        }

        [Fact]
        public void TestCreateEmptyPatchWithNoChangedProperties()
        {
            var result = PatchCreator.CreatePatch(GetEmptyProduct(), GetEmptyProduct());

            Assert.Empty(result);
        }

        [Fact]
        public void TestCreatePatchWithNewBarcode()
        {
            var result = PatchCreator.CreatePatch(GetEmptyProduct(), GetEmptyProduct(x => x.Code = "123456"));

            var op = Assert.Single(result);
            var setOp = Assert.IsType<OpSetProperty>(op);
            Assert.Equal("code", setOp.Path);
            Assert.Equal("123456", setOp.Value.GetValue<string>());
        }

        [Fact]
        public void TestCreatePatchWithNoBarcode()
        {
            var result = PatchCreator.CreatePatch(GetEmptyProduct(x => x.Code = "123456"), GetEmptyProduct());

            var op = Assert.Single(result);
            var setOp = Assert.IsType<OpUnsetProperty>(op);
            Assert.Equal("code", setOp.Path);
        }

        [Fact]
        public void TestCreatePatchWithChangedBarcode()
        {
            var result = PatchCreator.CreatePatch(GetEmptyProduct(x => x.Code = "123456"), GetEmptyProduct(x => x.Code = "654321"));

            var op = Assert.Single(result);
            var setOp = Assert.IsType<OpSetProperty>(op);
            Assert.Equal("code", setOp.Path);
            Assert.Equal("654321", setOp.Value.GetValue<string>());
        }

        [Fact]
        public void TestCreatePatchWithChangedNutritionalInfo()
        {
            var nutritionalInfo = new NutritionalInfo(100, 244, 10, 4, 60, 4, 12, 1, 0.1);
            var changedNutritionalInfo = new NutritionalInfo(100, 244, 10, 4, 62, 4, 12, 1, 0.1);

            var result = PatchCreator.CreatePatch(GetEmptyProduct(x => x.NutritionalInfo = nutritionalInfo),
                GetEmptyProduct(x => x.NutritionalInfo = changedNutritionalInfo));

            var op = Assert.Single(result);
            var setOp = Assert.IsType<OpSetProperty>(op);
            Assert.Equal("nutritionalInfo.carbohydrates", setOp.Path);
            Assert.Equal(62, setOp.Value.GetValue<double>());
        }

        [Fact]
        public void TestCreatePatchWithChangedDefaultServing()
        {
            var result = PatchCreator.CreatePatch(GetEmptyProduct(), GetEmptyProduct(x => x.DefaultServing = ServingType.Piece));

            var op = Assert.Single(result);
            var setOp = Assert.IsType<OpSetProperty>(op);
            Assert.Equal("defaultServing", setOp.Path);
            Assert.Equal("piece", setOp.Value.GetValue<string>());
        }

        [Fact]
        public void TestCreatePatchWithAddedTag()
        {
            var result = PatchCreator.CreatePatch(GetEmptyProduct(), GetEmptyProduct(x => x.Tags.Add("test")));

            var op = Assert.Single(result);
            var addOp = Assert.IsType<OpAddItem>(op);
            Assert.Equal("tags", addOp.Path);
            Assert.Equal("test", addOp.Item.GetValue<string>());
        }

        [Fact]
        public void TestCreatePatchWithAddedTagWithAlreadyExistingTags()
        {
            var result = PatchCreator.CreatePatch(GetEmptyProduct(x => x.Tags.Add("test")), GetEmptyProduct(x =>
            {
                x.Tags.Add("test");
                x.Tags.Add("hello");
            }));

            var op = Assert.Single(result);
            var addOp = Assert.IsType<OpAddItem>(op);
            Assert.Equal("tags", addOp.Path);
            Assert.Equal("hello", addOp.Item.GetValue<string>());
        }

        [Fact]
        public void TestCreatePatchWithAddedTagWithRemovedTag()
        {
            var result = PatchCreator.CreatePatch(GetEmptyProduct(x => x.Tags.Add("test")), GetEmptyProduct());

            var op = Assert.Single(result);
            var removeItem = Assert.IsType<OpRemoveItem>(op);
            Assert.Equal("tags", removeItem.Path);
            Assert.Equal("test", removeItem.Item.GetValue<string>());
        }

        [Fact]
        public void TestCreatePatchWithRemovedTagWithAlreadyExistingTags()
        {
            var result = PatchCreator.CreatePatch(GetEmptyProduct(x =>
            {
                x.Tags.Add("test");
                x.Tags.Add("hello");
            }), GetEmptyProduct(x => x.Tags.Add("test")));

            var op = Assert.Single(result);
            var removeItem = Assert.IsType<OpRemoveItem>(op);
            Assert.Equal("tags", removeItem.Path);
            Assert.Equal("hello", removeItem.Item.GetValue<string>());
        }

        [Fact]
        public void TestCreatePatchWithAddedLabel()
        {
            var result = PatchCreator.CreatePatch(GetEmptyProduct(), GetEmptyProduct(x => x.AddProductLabel("test label", "de")));

            var op = Assert.Single(result);
            var addItem = Assert.IsType<OpAddItem>(op);
            Assert.Equal("label", addItem.Path);
            Assert.Equal("{\"languageCode\":\"de\",\"value\":\"test label\"}", addItem.Item.ToString(Formatting.None));
        }

        [Fact]
        public void TestCreatePatchWithRemovedLabel()
        {
            var result = PatchCreator.CreatePatch(GetEmptyProduct(x => x.AddProductLabel("test label", "de")), GetEmptyProduct());

            var op = Assert.Single(result);
            var removeItem = Assert.IsType<OpRemoveItem>(op);
            Assert.Equal("label", removeItem.Path);
            Assert.Equal("{\"languageCode\":\"de\",\"value\":\"test label\"}", removeItem.Item.ToString(Formatting.None));
        }

        [Fact]
        public void TestCreatePatchWithAddedServings()
        {
            var result = PatchCreator.CreatePatch(GetEmptyProduct(), GetEmptyProduct(x => x.AddProductServing(ServingType.Piece, 27)));

            var op = Assert.Single(result);
            var typedOp = Assert.IsType<OpSetProperty>(op);
            Assert.Equal("servings.piece", typedOp.Path);
            Assert.Equal(27, typedOp.Value.GetValue<double>());
        }

        [Fact]
        public void TestCreatePatchWithRemovedServings()
        {
            var result = PatchCreator.CreatePatch(GetEmptyProduct(x => x.AddProductServing(ServingType.Piece, 27)), GetEmptyProduct());

            var op = Assert.Single(result);
            var typedOp = Assert.IsType<OpUnsetProperty>(op);
            Assert.Equal("servings.piece", typedOp.Path);
        }

        [Fact]
        public void TestCreatePatchWithChangedServing()
        {
            var result = PatchCreator.CreatePatch(GetEmptyProduct(x => x.AddProductServing(ServingType.Piece, 27)),
                GetEmptyProduct(x => x.AddProductServing(ServingType.Piece, 30)));

            var op = Assert.Single(result);
            var typedOp = Assert.IsType<OpSetProperty>(op);
            Assert.Equal("servings.piece", typedOp.Path);
            Assert.Equal(30, typedOp.Value.GetValue<double>());
        }
    }
}
