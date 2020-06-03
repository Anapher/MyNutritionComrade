using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Google.Apis.Auth;
using MyNutritionComrade.Models.Response;
using Xunit;

namespace MyNutritionComrade.IntegrationTests._Helpers
{
    public static class AccountHelper
    {
        public static async Task<LoginResponseDto> CreateAccount(this HttpClient client, TestGoogleAuthValidator authValidator, bool applyToHeader = true)
        {
            var userId = Guid.NewGuid().ToString("N");

            var token = Guid.NewGuid().ToString("N");
            authValidator.ValidLogins.TryAdd(token, new GoogleJsonWebSignature.Payload { Subject = userId, Email = $"{Guid.NewGuid():D}@email.com" });

            // Create account
            var response = await client.PostAsync("/api/v1/auth/login_with_google", new JsonContent(token));
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var result = await response.Content.DeserializeJsonObject<LoginResponseDto>();

            if (applyToHeader)
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);

            return result;
        }
    }
}
