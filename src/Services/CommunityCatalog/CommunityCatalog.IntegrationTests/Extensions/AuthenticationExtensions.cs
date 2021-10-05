using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using CommunityCatalog.Models.Request;
using CommunityCatalog.Models.Response;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Xunit;

namespace CommunityCatalog.IntegrationTests.Extensions
{
    public static class AuthenticationExtensions
    {
        public static async Task<string> LoginAndSetupClient(this CustomWebApplicationFactory factory,
            HttpClient client, string? emailAddress = null)
        {
            emailAddress ??= $"{Guid.NewGuid():N}@mynutritioncomrade.com";

            var emailPasswordTask = factory.EmailSender.WaitForPassword(emailAddress);
            await RequestPassword(client, emailAddress);

            var password = await emailPasswordTask.TimeoutAfter(TimeSpan.FromSeconds(10));
            Assert.NotEmpty(password);

            var loginResponse = await Login(client, emailAddress, password);

            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Jwt);

            return emailAddress;
        }

        private static async Task RequestPassword(HttpClient client, string emailAddress)
        {
            var response = await client.PostAsync("api/v1/authentication/request_password",
                JsonContent.Create(new RequestPasswordDto(emailAddress)));
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        private static async Task<LoginResponseDto> Login(HttpClient client, string emailAddress, string password)
        {
            var response = await client.PostAsync("api/v1/authentication/login",
                JsonContent.Create(new LoginRequestDto(emailAddress, password)));
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var data = await response.Content.ReadFromJsonAsync<LoginResponseDto>();
            Assert.NotNull(data);

            return data!;
        }
    }
}
