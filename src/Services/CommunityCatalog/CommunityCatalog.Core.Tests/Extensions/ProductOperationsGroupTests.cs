using System.Collections.Generic;
using System.Linq;
using CommunityCatalog.Core.Services;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using MyNutritionComrade.Models;
using Xunit;

namespace CommunityCatalog.Core.Tests.Extensions
{
    public class ProductOperationsGroupTests
    {
        [Fact]
        public void GroupOperations_NoOperations_ReturnEmpty()
        {
            // arrange
            var operations = new List<Operation>();

            // act
            var result = ProductOperationsGroup.GroupOperations(operations);

            // assert
            Assert.Empty(result);
        }

        [Fact]
        public void GroupOperations_NutritionalInfo_ReturnGroups()
        {
            // arrange
            var document = new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                JsonOptions.Default.ContractResolver);
            document.Add(x => x.NutritionalInfo.Fat, 20);
            document.Add(x => x.NutritionalInfo.Protein, 18);

            // act
            var result = ProductOperationsGroup.GroupOperations(document.Operations);

            // assert
            var nutritionsGroup = Assert.Single(result);
            Assert.Equal(document.Operations, nutritionsGroup.Operations);
        }

        [Fact]
        public void GroupOperations_OtherChanges_EveryInSeparateGroup()
        {
            // arrange
            var document = new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                JsonOptions.Default.ContractResolver);
            document.Add(x => x.NutritionalInfo.Fat, 20);
            document.Add(x => x.Code, "hello world");
            document.Add(x => x.DefaultServing, ServingType.Bottle);

            // act
            var result = ProductOperationsGroup.GroupOperations(document.Operations);

            // assert
            Assert.All(result, x => Assert.Single(x.Operations));
        }

        [Fact]
        public void GroupOperations_ItemStateChange_Group()
        {
            // arrange
            var document = new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                JsonOptions.Default.ContractResolver);
            document.Add(x => x.Tags![ProductProperties.TAG_LIQUID], true);
            document.Add(x => x.Servings[ServingType.Milliliter], 1);
            document.Remove(x => x.Servings[ServingType.Gram]);

            // act
            var result = ProductOperationsGroup.GroupOperations(document.Operations).ToList();

            // assert
            var group = Assert.Single(result);
            AssertHelper.AssertScrambledEquals(document.Operations, group.Operations);
        }
    }
}
