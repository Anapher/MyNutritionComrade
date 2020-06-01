// 1. Try to use routes that require authentication with no authorization header
// 2. Try create Google account with invalid token
// 3. Create a new account
// 4. Refresh the access token

using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Google.Apis.Auth;
using MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation;
using MyNutritionComrade.IntegrationTests._Helpers;
using MyNutritionComrade.Models.Response;
using Xunit;

namespace MyNutritionComrade.IntegrationTests.Tests
{
    public class IntegrationTest1Auth : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly TestGoogleAuthValidator _authValidator;

        public IntegrationTest1Auth(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
            _authValidator = factory.GoogleAuthValidator;
        }

        [Fact]
        public async Task Run()
        {
            var userId = Guid.NewGuid().ToString("N");

            var token = Guid.NewGuid().ToString("N");
            _authValidator.ValidLogins.TryAdd(token, new GoogleJsonWebSignature.Payload {Subject = userId, Email = "test@email.com"});

            // 1. Try to use routes that require authentication with no authorization header
            var response = await _client.PutAsync("/api/v1/consumption/2020-05-31/snack",
                new JsonContent(new CustomFoodPortionCreationDto(TestValues.TestNutritionalInfo, "test food")));
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);

            // 2. Try create Google account with invalid token
            response = await _client.PostAsync("/api/v1/auth/login_with_google", new JsonContent("invalid token"));
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);

            // 3. Create a new account
            response = await _client.PostAsync("/api/v1/auth/login_with_google", new JsonContent(token));
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var result = await response.Content.DeserializeJsonObject<LoginResponseDto>();
            Assert.NotNull(result?.RefreshToken);
            Assert.NotNull(result.AccessToken);

            // 4. Refresh the access token
            response = await _client.PostAsync("/api/v1/auth/refreshtoken", new JsonContent(new ExchangeRefreshTokenResponseDto(result.AccessToken, result.RefreshToken)));
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var refreshToken = await response.Content.DeserializeJsonObject<ExchangeRefreshTokenResponseDto>();
            Assert.NotNull(refreshToken?.RefreshToken);
            Assert.NotNull(refreshToken.AccessToken);
        }
    }
}
