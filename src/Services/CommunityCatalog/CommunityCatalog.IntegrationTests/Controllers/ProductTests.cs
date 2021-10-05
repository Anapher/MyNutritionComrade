using System.Collections.Generic;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using CommunityCatalog.IntegrationTests._Helpers;
using CommunityCatalog.IntegrationTests.Extensions;
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
            // arrange
            var response = await Client.GetAsync("api/v1/product/index.json");
            var result = await response.EnsureSuccessStatusCode().Content
                .ReadFromJsonAsync<IReadOnlyList<RepositoryReference>>();
            var repository = Assert.Single(result);

            // act
            response = await Client.GetAsync(repository.Url);

            // assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var products = await response.Content.ReadFromJsonNetAsync<IReadOnlyList<Product>>();
            Assert.NotNull(products);
        }
    }
}
