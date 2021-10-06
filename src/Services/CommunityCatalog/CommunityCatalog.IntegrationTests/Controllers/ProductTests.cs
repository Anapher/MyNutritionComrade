using System.Collections.Generic;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using CommunityCatalog.Core;
using CommunityCatalog.Core.Response;
using CommunityCatalog.IntegrationTests._Helpers;
using CommunityCatalog.IntegrationTests.Extensions;
using CommunityCatalog.Models.Response;
using MyNutritionComrade.Models;
using MyNutritionComrade.Models.Index;
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
            var response = await Client.PostAsync("api/v1/product", JsonNetContent.Create(product));

            // assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var dto = await response.Content.ReadFromJsonNetAsync<ProductCreatedDto>();
            Assert.NotNull(dto?.ProductId);
        }

        [Fact]
        public async Task Create_InvalidProduct_BadRequest()
        {
            // arrange
            var product = TestValues.TestProduct with { Label = new Dictionary<string, ProductLabel>() };

            await Factory.LoginAndSetupClient(Client);

            // act
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
        public async Task GetIndexFile_NotAuthenticated_ReturnNonEmptyUrl()
        {
            // act
            var response = await Client.GetAsync("api/v1/product/index.json");

            // assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var result = await response.Content.ReadFromJsonAsync<IReadOnlyList<RepositoryReference>>();
            var repository = Assert.Single(result);

            Assert.NotNull(repository.Url);
        }

        [Fact]
        public async Task GetIndexFile_NotAuthenticated_ReturnValidUrl()
        {
            var products = await Api.GetAllProducts(Client);
            Assert.Empty(products);
        }

        private async Task<string> CreateProduct(ProductProperties? product = null)
        {
            // arrange
            product ??= TestValues.TestProduct;

            // act
            var response = await Client.PostAsync("api/v1/product", JsonNetContent.Create(product));

            // assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var dto = await response.Content.ReadFromJsonNetAsync<ProductCreatedDto>();
            Assert.NotNull(dto?.ProductId);

            return dto?.ProductId!;
        }

        [Fact]
        public async Task GetProductContributions_NewProduct_SingleContribution()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await CreateProduct();

            // act
            var response = await Client.GetAsync($"api/v1/product/{productId}/contributions");

            // assert
            var result = await response.EnsureSuccessStatusCode().Content
                .ReadFromJsonNetAsync<IReadOnlyList<ProductContributionDto>>();
            Assert.Single(result);
        }
    }
}
