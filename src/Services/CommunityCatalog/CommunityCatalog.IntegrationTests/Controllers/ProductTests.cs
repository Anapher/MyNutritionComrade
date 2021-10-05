using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using CommunityCatalog.IntegrationTests._Helpers;
using CommunityCatalog.IntegrationTests.Extensions;
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
            var response = await Client.PostAsync("api/v1/product", JsonNetContent.Create(product));

            // arrange
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

            // arrange
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
