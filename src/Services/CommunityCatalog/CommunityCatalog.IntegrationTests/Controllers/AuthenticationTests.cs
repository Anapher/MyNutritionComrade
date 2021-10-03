using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using CommunityCatalog.IntegrationTests.Extensions;
using CommunityCatalog.Models.Request;
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
        public async Task RequestPassword_ValidEmail_SendPasswordToEmail()
        {
            // arrange
            const string emailAddress = "test@mynutritioncomrade.de";
            var emailPasswordTask = _factory.EmailSender.WaitForPassword(emailAddress);

            // act
            var response = await _client.PostAsync("api/v1/authentication/request_password",
                JsonContent.Create(new RequestPasswordDto(emailAddress)));

            // assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var emailPassword = await emailPasswordTask.TimeoutAfter(TimeSpan.FromSeconds(10));
            Assert.NotEmpty(emailPassword);
        }
    }
}
