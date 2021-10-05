using System;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using CommunityCatalog.IntegrationTests._Helpers;
using CommunityCatalog.IntegrationTests.Extensions;
using CommunityCatalog.Models.Request;
using CommunityCatalog.Models.Response;
using Xunit;
using Xunit.Abstractions;

namespace CommunityCatalog.IntegrationTests.Controllers
{
    [Collection(IntegrationTestCollection.Definition)]
    public class AuthenticationTests : IntegrationTestBase
    {
        public AuthenticationTests(ITestOutputHelper testOutputHelper, MongoDbFixture mongoDb) : base(testOutputHelper,
            mongoDb)
        {
        }

        [Fact]
        public async Task<(string emailAddress, string password)> RequestPassword_ValidEmail_SendPasswordToEmail()
        {
            // arrange
            var emailAddress = $"{Guid.NewGuid():N}@mynutritioncomrade.de";
            var emailPasswordTask = Factory.EmailSender.WaitForPassword(emailAddress);

            // act
            var response = await Client.PostAsync("api/v1/authentication/request_password",
                JsonContent.Create(new RequestPasswordDto(emailAddress)));

            // assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var emailPassword = await emailPasswordTask.TimeoutAfter(TimeSpan.FromSeconds(10));
            Assert.NotEmpty(emailPassword);

            return (emailAddress, emailPassword);
        }

        [Fact]
        public async Task RequestPassword_EmptyEmail_BadRequest()
        {
            // act
            var response = await Client.PostAsync("api/v1/authentication/request_password",
                JsonContent.Create(new RequestPasswordDto("")));

            // assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Login_ValidPassword_ReceiveJwt()
        {
            // arrange
            var (emailAddress, password) = await RequestPassword_ValidEmail_SendPasswordToEmail();

            // act
            var response = await Client.PostAsync("api/v1/authentication/login",
                JsonContent.Create(new LoginRequestDto(emailAddress, password)));

            // assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var result = await response.Content.ReadFromJsonAsync<LoginResponseDto>();
            Assert.NotEmpty(result?.Jwt);
        }

        [Fact]
        public async Task Login_InvalidPassword_BadRequest()
        {
            // act
            var response = await Client.PostAsync("api/v1/authentication/login",
                JsonContent.Create(new LoginRequestDto("test@test123.de", "hello world")));

            // assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Login_EmptyPassword_BadRequest()
        {
            // act
            var response = await Client.PostAsync("api/v1/authentication/login",
                JsonContent.Create(new LoginRequestDto("test@test123.de", "")));

            // assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
