using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using CommunityCatalog.Core;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Response;
using CommunityCatalog.IntegrationTests._Helpers;
using CommunityCatalog.IntegrationTests.Extensions;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using MyNutritionComrade.Models;
using Xunit;
using Xunit.Abstractions;

namespace CommunityCatalog.IntegrationTests.Controllers
{
    [Collection(IntegrationTestCollection.Definition)]
    public class ProductTests : IntegrationTestBase
    {
        public ProductTests(ITestOutputHelper testOutputHelper, MongoDbFixture mongoDb) : base(testOutputHelper,
            mongoDb)
        {
        }

        [Fact]
        public async Task Create_NotAuthorized_UnauthorizedError()
        {
            // arrange
            var product = TestValues.TestProduct;

            // act
            var response = await Client.PostAsync("api/v1/Product", JsonNetContent.Create(product));

            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Create_ValidProduct_CreateProduct()
        {
            // arrange
            var product = TestValues.TestProduct;
            await Factory.LoginAndSetupClient(Client);

            // act
            await Api.CreateProduct(Client, product);
        }

        [Fact]
        public async Task Create_InvalidProduct_BadRequest()
        {
            // arrange
            var product = TestValues.TestProduct with { Label = new Dictionary<string, ProductLabel>() };

            await Factory.LoginAndSetupClient(Client);

            // act
            await Api.CreateProduct(Client, product);
            var response = await Client.PostAsync("api/v1/product", JsonNetContent.Create(product));

            // assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Create_TwoProductsWithEqualCode_SecondCreateFails()
        {
            var product = TestValues.TestProduct with { Code = "123" };

            // arrange
            await Factory.LoginAndSetupClient(Client);
            await Api.CreateProduct(Client, product);

            // act
            var ex = await Assert.ThrowsAnyAsync<IdErrorException>(async () =>
                await Api.CreateProduct(Client, product));
            Assert.Equal(NutritionComradeErrorCode.ProductCodeAlreadyExists.ToString(), ex.Error.Code);

            // assert
            var products = await Api.GetAllProducts(Client);
            var existingProduct = Assert.Single(products);

            AssertHelper.AssertObjectsEqualJson(product, existingProduct);
        }

        [Fact]
        public async Task GetIndexFile_NoProductsExist_ReturnNonEmptyUrlAndDateTimeMin()
        {
            // act
            var repositories = await Api.GetAllRepositories(Client);

            // assert
            var repository = Assert.Single(repositories);

            Assert.NotNull(repository.Url);
            Assert.Equal(DateTimeOffset.MinValue, repository.Timestamp);
        }

        [Fact]
        public async Task GetIndexFile_ProductExists_ReturnDateTimeGreaterThanMin()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            await Api.CreateProduct(Client, TestValues.TestProduct);

            // act
            var repositories = await Api.GetAllRepositories(Client);

            // assert
            var repository = Assert.Single(repositories);

            Assert.NotEqual(DateTimeOffset.MinValue, repository.Timestamp);
        }

        [Fact]
        public async Task GetAllProducts_NoProducts_ReturnEmptyProducts()
        {
            // act
            var products = await Api.GetAllProducts(Client);

            // assert
            Assert.Empty(products);
        }

        [Fact]
        public async Task GetProductContributions_NewProduct_SingleContribution()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            // act
            var contributions = await Api.GetProductContributions(Client, productId);

            // assert
            Assert.Single(contributions);
        }

        [Fact]
        public async Task PatchProduct_ProductDoesNotExist_BadRequest()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var patch = new JsonPatchDocument<ProductProperties>().Add(x => x.Code, "hello world");

            // act
            var ex = await Assert.ThrowsAsync<IdErrorException>(async () =>
                await Api.PatchProduct(Client, "123", patch.Operations));

            // assert
            AssertHelper.AssertErrorType(ex.Error, NutritionComradeErrorCode.ProductNotFound);
        }

        [Fact]
        public async Task PatchProduct_ProductExists_CreateContribution()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            var patch = new JsonPatchDocument<ProductProperties>().Add(x => x.Code, "hello world");

            // act
            await Api.PatchProduct(Client, productId, patch.Operations);

            // assert
            var contributions = await Api.GetProductContributions(Client, productId);
            Assert.Equal(2, contributions.Count);

            var contribution = contributions.Single(x => x.Status == ProductContributionStatus.Pending);
            Assert.True(contribution.CreatedByYou);
            Assert.Equal(productId, contribution.ProductId);
            Assert.Null(contribution.YourVote);
            Assert.Equal(new ProductContributionStatisticsDto(0, 0), contribution.Statistics);
            Assert.NotEmpty(contribution.Id);

            var op = Assert.Single(contribution.Operations);
            Assert.Equal("/Code", op.path);
            Assert.Equal("hello world", op.value);
            Assert.Equal(OperationType.Add, op.OperationType);
        }

        [Fact]
        public async Task PatchProduct_MultipleOperations_CreateContributions()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            var patch = new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                    JsonConfig.Default.ContractResolver).Add(x => x.Code, "hello world")
                .Add(x => x.NutritionalInfo.Protein, 11);

            // act
            await Api.PatchProduct(Client, productId, patch.Operations);

            // assert
            var contributions = await Api.GetProductContributions(Client, productId);
            Assert.Equal(3, contributions.Count);
        }

        [Fact]
        public async Task PatchProduct_CreateContributionTwice_ErrorOnSecondTry()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            var patch = new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                JsonConfig.Default.ContractResolver).Add(x => x.Code, "hello world");

            await Api.PatchProduct(Client, productId, patch.Operations);

            // act
            var ex = await Assert.ThrowsAsync<IdErrorException>(async () =>
                await Api.PatchProduct(Client, productId, patch.Operations));

            // assert
            AssertHelper.AssertErrorType(ex.Error, NutritionComradeErrorCode.ProductContributionCreatorCannotVote);
        }
    }
}
