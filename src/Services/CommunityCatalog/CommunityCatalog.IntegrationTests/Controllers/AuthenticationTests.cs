using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using CommunityCatalog.IntegrationTests.Extensions;
using CommunityCatalog.Models.Request;
using CommunityCatalog.Models.Response;
using Xunit;
using Xunit.Abstractions;

namespace CommunityCatalog.IntegrationTests.Controllers
{
    [Collection(IntegrationTestCollection.Definition)]
    public class AuthenticationTests
    {
        private readonly CustomWebApplicationFactory _factory;
        private readonly HttpClient _client;

        public AuthenticationTests(MongoDbFixture mongoDb, ITestOutputHelper testOutputHelper)
        {
            _factory = new CustomWebApplicationFactory(mongoDb, testOutputHelper);
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task<(string emailAddress, string password)> RequestPassword_ValidEmail_SendPasswordToEmail()
        {
            // arrange
            var emailAddress = $"{Guid.NewGuid():N}@mynutritioncomrade.de";
            var emailPasswordTask = _factory.EmailSender.WaitForPassword(emailAddress);

            // act
            var response = await _client.PostAsync("api/v1/authentication/request_password",
                JsonContent.Create(new RequestPasswordDto(emailAddress)));

            // assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var emailPassword = await emailPasswordTask.TimeoutAfter(TimeSpan.FromSeconds(10));
            Assert.NotEmpty(emailPassword);

            return (emailAddress, emailPassword);
        }

        [Fact]
        public async Task Login_ValidPassword_ReceiveJwt()
        {
            // arrange
            var (emailAddress, password) = await RequestPassword_ValidEmail_SendPasswordToEmail();

            // act
            var response = await _client.PostAsync("api/v1/authentication/login",
                JsonContent.Create(new LoginRequestDto(emailAddress, password)));

            // assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var result = await response.Content.ReadFromJsonAsync<LoginResponseDto>();
            Assert.NotEmpty(result.Jwt);
        }
    }
}
