using System.Globalization;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Models.Request;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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

        private async Task Authenticate()
        {
            var httpResponse = await _client.PostAsync("/api/v1/auth/login",
                new StringContent(JsonConvert.SerializeObject(new LoginRequestDto { UserName = "mmacneil", Password = "Pa$$W0rd1" }), Encoding.UTF8,
                    "application/json"));
            httpResponse.EnsureSuccessStatusCode();
            var stringResponse = await httpResponse.Content.ReadAsStringAsync();

            dynamic result = JObject.Parse(stringResponse);
            string accessToken = result.accessToken;

            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }

        [Fact]
        public async Task CantCreateInvalidProduct()
        {
            await Authenticate();

            var productInfo = new ProductInfo();
            productInfo.DefaultServing = ServingType.Gram;
            productInfo.AddProductLabel("Haferflocken", CultureInfo.CurrentCulture);
            productInfo.AddProductServing(ServingType.Gram, 1);
            productInfo.NutritionInformation = new NutritionInformation(100, 300, 0, 0, 80, 0, 20, 0, 0);
            productInfo.Tags.Add("liquid");

            var httpResponse = await _client.PostAsync("/api/v1/products", new StringContent(JsonConvert.SerializeObject(productInfo), Encoding.UTF8, "application/json"));
            Assert.Equal(HttpStatusCode.BadRequest, httpResponse.StatusCode);
            var response = await httpResponse.Content.ReadAsStringAsync();
        }
    }
}
