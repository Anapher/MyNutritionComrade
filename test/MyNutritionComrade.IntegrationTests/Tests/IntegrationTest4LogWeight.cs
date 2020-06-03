using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.IntegrationTests._Helpers;
using MyNutritionComrade.Models.Paging;
using Newtonsoft.Json;
using Xunit;

namespace MyNutritionComrade.IntegrationTests.Tests
{
    public class IntegrationTest4LogWeight : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly TestGoogleAuthValidator _authValidator;
        private readonly HttpClient _client;
        private readonly JsonSerializer _serializer;

        public IntegrationTest4LogWeight(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
            _authValidator = factory.GoogleAuthValidator;
            _serializer = factory.Services.GetRequiredService<JsonSerializer>();
        }

        private async Task<PagingResponse<LoggedWeight>> GetLoggedWeight()
        {
            var response = await _client.GetAsync("/api/v1/loggedweight");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            return await response.Content.DeserializeJsonObject<PagingResponse<LoggedWeight>>();
        }

        [Fact]
        public async Task Run()
        {
            var timestamp = new DateTimeOffset(2020, 6, 1, 20, 30, 0, TimeSpan.Zero);

            await _client.CreateAccount(_authValidator);

            // Get logged weight
            var data = await GetLoggedWeight();
            Assert.Empty(data.Data);

            // Create logged weight
            var response = await _client.PutAsync($"/api/v1/loggedweight/{timestamp:O}", new JsonContent(78.5));
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            // Get logged weight
            data = await GetLoggedWeight();
            var entry = Assert.Single(data.Data);
            Assert.Equal(78.5, entry.Value);
            Assert.Equal(timestamp, entry.Timestamp);

            // Delete logged weight
            response = await _client.DeleteAsync($"/api/v1/loggedweight/{timestamp:O}");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            // Get logged weight
            data = await GetLoggedWeight();
            Assert.Empty(data.Data);
        }
    }
}
