//using System.Net;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Threading.Tasks;
//using MyNutritionComrade.IntegrationTests.Utils;
//using MyNutritionComrade.Models.Request;
//using Newtonsoft.Json.Linq;
//using Xunit;

//namespace MyNutritionComrade.IntegrationTests.Controllers
//{
//    public class AuthControllerIntegrationTests : IClassFixture<CustomWebApplicationFactory>
//    {
//        public AuthControllerIntegrationTests(CustomWebApplicationFactory factory)
//        {
//            _client = factory.CreateClient();
//        }

//        private readonly HttpClient _client;

//        public static async Task Authenticate(HttpClient client)
//        {
//            var httpResponse = await client.PostAsync("/api/v1/auth/login",
//                new JsonContent(new LoginRequestDto {UserName = "mmacneil", Password = "Pa$$W0rd1"}));
//            httpResponse.EnsureSuccessStatusCode();
//            var stringResponse = await httpResponse.Content.ReadAsStringAsync();

//            dynamic result = JObject.Parse(stringResponse);
//            string accessToken = result.accessToken;

//            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
//        }

//        [Fact]
//        public async Task CanExchangeValidRefreshToken()
//        {
//            var httpResponse = await _client.PostAsync("/api/v1/auth/refreshtoken",
//                new JsonContent(new ExchangeRefreshTokenRequestDto
//                {
//                    AccessToken =
//                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtbWFjbmVpbCIsImp0aSI6IjA0YjA0N2E4LTViMjMtNDgwNi04M2IyLTg3ODVhYmViM2ZjNyIsImlhdCI6MTUzOTUzNzA4Mywicm9sIjoiYXBpX2FjY2VzcyIsImlkIjoiNDE1MzI5NDUtNTk5ZS00OTEwLTk1OTktMGU3NDAyMDE3ZmJlIiwibmJmIjoxNTM5NTM3MDgyLCJleHAiOjE1Mzk1NDQyODIsImlzcyI6IndlYkFwaSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC8ifQ.xzDQOKzPZarve68Np8Iu8sh2oqoCpHSmp8fMdYRHC_k",
//                    RefreshToken = "rB1afdEe6MWu6TyN8zm58xqt/3KWOLRAah2nHLWcboA="
//                }));
//            httpResponse.EnsureSuccessStatusCode();
//            var stringResponse = await httpResponse.Content.ReadAsStringAsync();
//            dynamic result = JObject.Parse(stringResponse);
//            Assert.NotNull(result.accessToken);
//            Assert.NotNull(result.refreshToken);
//        }

//        [Fact]
//        public async Task CanLoginWithValidCredentials()
//        {
//            var httpResponse = await _client.PostAsync("/api/v1/auth/login",
//                new JsonContent(new LoginRequestDto {UserName = "mmacneil", Password = "Pa$$W0rd1"}));
//            httpResponse.EnsureSuccessStatusCode();
//            var stringResponse = await httpResponse.Content.ReadAsStringAsync();
//            dynamic result = JObject.Parse(stringResponse);
//            Assert.NotNull(result.accessToken);
//            Assert.NotNull(result.refreshToken);
//        }

//        [Fact]
//        public async Task CantExchangeInvalidRefreshToken()
//        {
//            var httpResponse = await _client.PostAsync("/api/v1/auth/refreshtoken",
//                new JsonContent(new ExchangeRefreshTokenRequestDto
//                {
//                    AccessToken =
//                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtbWFjbmVpbCIsImp0aSI6IjA0YjA0N2E4LTViMjMtNDgwNi04M2IyLTg3ODVhYmViM2ZjNyIsImlhdCI6MTUzOTUzNzA4Mywicm9sIjoiYXBpX2FjY2VzcyIsImlkIjoiNDE1MzI5NDUtNTk5ZS00OTEwLTk1OTktMGU3NDAyMDE3ZmJlIiwibmJmIjoxNTM5NTM3MDgyLCJleHAiOjE1Mzk1NDQyODIsImlzcyI6IndlYkFwaSIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC8ifQ.xzDQOKzPZarve68Np8Iu8sh2oqoCpHSmp8fMdYRHC_k",
//                    RefreshToken = "unknown"
//                }));
//            var stringResponse = await httpResponse.Content.ReadAsStringAsync();
//            Assert.Contains("Invalid token.", stringResponse);
//        }

//        [Fact]
//        public async Task CantLoginWithInvalidCredentials()
//        {
//            var httpResponse = await _client.PostAsync("/api/v1/auth/login",
//                new JsonContent(new LoginRequestDto {UserName = "unknown", Password = "Rhcp1234"}));
//            var stringResponse = await httpResponse.Content.ReadAsStringAsync();
//            Assert.Contains("The user was not found.", stringResponse);
//            Assert.Equal(HttpStatusCode.Unauthorized, httpResponse.StatusCode);
//        }
//    }
//}
