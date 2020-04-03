using System.Globalization;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.IntegrationTests.Utils;
using Xunit;

namespace MyNutritionComrade.IntegrationTests.Controllers
{
    public class ProductController : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;

        public ProductController(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task CantCreateInvalidProduct()
        {
            await AuthControllerIntegrationTests.Authenticate(_client);

            var productInfo = new ProductInfo();
            productInfo.DefaultServing = ServingType.Gram;
            productInfo.AddProductLabel("Haferflocken", CultureInfo.CurrentCulture);
            productInfo.AddProductServing(ServingType.Gram, 1);
            productInfo.NutritionalInfo = new NutritionalInfo(100, 300, 0, 0, 80, 0, 20, 0, 0);
            productInfo.Tags.Add("liquid");

            var httpResponse = await _client.PostAsync("/api/v1/products", new JsonContent(productInfo));
            Assert.Equal(HttpStatusCode.BadRequest, httpResponse.StatusCode);
            var response = await httpResponse.Content.ReadAsStringAsync();
        }
    }
}
