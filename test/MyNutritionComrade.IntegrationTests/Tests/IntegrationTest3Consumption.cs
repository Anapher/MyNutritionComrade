using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Google.Apis.Auth;
using Microsoft.Extensions.DependencyInjection;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation;
using MyNutritionComrade.IntegrationTests._Helpers;
using MyNutritionComrade.Models.Response;
using Newtonsoft.Json;
using Xunit;

namespace MyNutritionComrade.IntegrationTests.Tests
{
    public class IntegrationTest3Consumption : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly TestGoogleAuthValidator _authValidator;
        private readonly HttpClient _client;
        private readonly JsonSerializer _serializer;

        public IntegrationTest3Consumption(CustomWebApplicationFactory factory)
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
            _authValidator.ValidLogins.TryAdd(token, new GoogleJsonWebSignature.Payload { Subject = userId, Email = "test4@email.com" });

            // Create account
            var response = await _client.PostAsync("/api/v1/auth/login_with_google", new JsonContent(token));
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var result = await response.Content.DeserializeJsonObject<LoginResponseDto>();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);

            // Create product
            var product = new ProductInfo {NutritionalInfo = TestValues.TestNutritionalInfo};
            product.Label.Add("de", new ProductLabel("Magerquark"));
            product.AddProductServing(ServingType.Gram, 1);
            product.DefaultServing = ServingType.Gram;

            response = await _client.PostAsync("/api/v1/products", new JsonContent(product));
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);

            var productData = await response.Content.DeserializeJsonObject<ProductDto>(_serializer);

            // Consume product
            response = await _client.PutAsync("/api/v1/consumption/2020-06-01/snack",
                new JsonContent(new ProductFoodPortionCreationDto(productData.Id, 120, ServingType.Gram)));
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            // Query consumed
            response = await _client.GetAsync("/api/v1/consumption/2020-06-01");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var diary = await response.Content.DeserializeJsonObject<Dictionary<string, List<ConsumedDto>>>(_serializer);
            Assert.NotEmpty(diary);
            var dayConsumption = Assert.Single(diary);
            Assert.Equal("2020-06-01", dayConsumption.Key);

            var consumedDto = Assert.Single(dayConsumption.Value);
            Assert.Equal(ConsumptionTime.Snack, consumedDto.Time);
            Assert.Equal(new DateTime(2020, 06, 1), consumedDto.Date);

            var portion = Assert.IsType<FoodPortionProductDto>(consumedDto.FoodPortion);
            Assert.Equal(productData.Id, portion.Product.Id);
            Assert.Equal(ServingType.Gram, portion.ServingType);
            Assert.Equal(120, portion.Amount);
            Assert.Equal(120, portion.NutritionalInfo.Volume);

            // Delete consumed
            response = await _client.DeleteAsync($"/api/v1/consumption/2020-06-01/snack/product@{productData.Id}");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            // Query consumed
            response = await _client.GetAsync("/api/v1/consumption/2020-06-01");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            diary = await response.Content.DeserializeJsonObject<Dictionary<string, List<ConsumedDto>>>(_serializer);
            dayConsumption = Assert.Single(diary);
            Assert.Empty(dayConsumption.Value);
        }
    }
}
