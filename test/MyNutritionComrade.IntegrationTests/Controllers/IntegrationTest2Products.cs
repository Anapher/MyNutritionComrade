using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Google.Apis.Auth;
using Microsoft.Extensions.DependencyInjection;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.IntegrationTests._Helpers;
using MyNutritionComrade.Models.Response;
using MyNutritionComrade.Selectors;
using Newtonsoft.Json;
using Xunit;

namespace MyNutritionComrade.IntegrationTests.Controllers
{
    public class IntegrationTest2Products : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly TestGoogleAuthValidator _authValidator;
        private readonly JsonSerializer _serializer;

        public IntegrationTest2Products(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
            _authValidator = factory.GoogleAuthValidator;
            _serializer = factory.Services.GetRequiredService<JsonSerializer>();
        }

        [Fact]
        public async Task Run()
        {
            var userId = Guid.NewGuid().ToString("N");

            var token = Guid.NewGuid().ToString("N");
            _authValidator.ValidLogins.TryAdd(token, new GoogleJsonWebSignature.Payload {Subject = userId, Email = "test@email.com"});

            // 1. Create a new account
            var response = await _client.PostAsync("/api/v1/auth/login_with_google", new JsonContent(token));
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var result = await response.Content.DeserializeJsonObject<LoginResponseDto>();
            Assert.NotNull(result?.RefreshToken);
            Assert.NotNull(result.AccessToken);

            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);

            // 2. Create new product
            var product = new ProductInfo {NutritionalInfo = TestValues.TestNutritionalInfo, Code = "abc"};
            product.AddProductLabel("Haferflocken", "de");
            product.AddProductServing(ServingType.Gram, 1);
            product.DefaultServing = ServingType.Gram;

            response = await _client.PostAsync("/api/v1/products", new JsonContent(product));
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);

            // 3. Search product
            async Task ValidateSearchResult()
            {
                Assert.Equal(HttpStatusCode.OK, response.StatusCode);

                var foundProducts = await response.Content.DeserializeJsonObject<ProductSuggestion[]>(_serializer);
                var foundProduct = Assert.Single(foundProducts);
                var productSearchResult = Assert.IsType<ProductSuggestion>(foundProduct);
                Assert.Equal(product.Code, productSearchResult.Product.Code);
                Assert.Equal(product.DefaultServing, productSearchResult.Product.DefaultServing);
                Assert.Equal(product.Tags, productSearchResult.Product.Tags);
                Assert.Equal(product.NutritionalInfo, productSearchResult.Product.NutritionalInfo);
                Assert.Equal(Assert.Single(product.Label).Value, Assert.Single(productSearchResult.Product.Label).Value);
            }

            response = await _client.GetAsync("/api/v1/products/search?term=Haf");
            await ValidateSearchResult();

            // 4. Get product by code
            response = await _client.GetAsync("/api/v1/products/search?barcode=abc");
            await ValidateSearchResult();
        }
    }
}
