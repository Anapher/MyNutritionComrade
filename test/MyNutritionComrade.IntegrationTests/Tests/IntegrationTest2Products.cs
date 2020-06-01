using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Google.Apis.Auth;
using Microsoft.Extensions.DependencyInjection;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.IntegrationTests._Helpers;
using MyNutritionComrade.Models.Paging;
using MyNutritionComrade.Models.Response;
using MyNutritionComrade.Selectors;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace MyNutritionComrade.IntegrationTests.Tests
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
        //
        public async Task<ProductContributionDto> CreateProductContribution(string productId)
        {
            var userId = Guid.NewGuid().ToString("N");

            var token = Guid.NewGuid().ToString("N");
            _authValidator.ValidLogins.TryAdd(token, new GoogleJsonWebSignature.Payload { Subject = userId, Email = "test2@email.com" });
            var response = await _client.SendAsync(
                new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/login_with_google") {Content = new JsonContent(token)});

            var accessInfo = await response.Content.DeserializeJsonObject<LoginResponseDto>();

            response = await _client.SendAsync(new HttpRequestMessage(HttpMethod.Patch, $"/api/v1/products/{productId}")
            {
                Content = new JsonContent(new List<PatchOperation>
                {
                    new OpAddItem("label", JToken.FromObject(new ProductLabel("Oatmeal", "en"))), new OpSetProperty("code", JToken.FromObject("zdf"))
                }),
                Headers = {Authorization = new AuthenticationHeaderValue("Bearer", accessInfo.AccessToken)}
            });

            var asd = await response.Content.ReadAsStringAsync();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            response = await _client.SendAsync(new HttpRequestMessage(HttpMethod.Get, $"/api/v1/products/{productId}/contributions")
            {
                Headers = {Authorization = new AuthenticationHeaderValue("Bearer", accessInfo.AccessToken)}
            });

            var contributions = await response.Content.DeserializeJsonObject<PagingResponse<ProductContributionDto>>(_serializer);
            Assert.Equal(3, contributions.Data.Count);

            var initial = contributions.Data.Last();
            Assert.Equal(ProductContributionStatus.Applied, initial.Status);

            var contribution = contributions.Data.First(x => x.Patch.First().Path == "code");
            Assert.Equal(ProductContributionStatus.Pending, contribution.Status);
            Assert.True(contribution.IsContributionFromUser);

            return contribution;
        }

        private async Task VoteContribution(string contributionId, bool vote)
        {
            var userId = Guid.NewGuid().ToString("N");

            var token = Guid.NewGuid().ToString("N");
            _authValidator.ValidLogins.TryAdd(token, new GoogleJsonWebSignature.Payload { Subject = userId, Email = "test2@email.com" });
            var response = await _client.SendAsync(
                new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/login_with_google") { Content = new JsonContent(token) });

            var accessToken = (await response.Content.DeserializeJsonObject<LoginResponseDto>()).AccessToken;
            response = await _client.SendAsync(new HttpRequestMessage(HttpMethod.Post, $"/api/v1/products/contributions/{contributionId}/vote")
            {
                Content = new JsonContent(vote), Headers = {Authorization = new AuthenticationHeaderValue("Bearer", accessToken)}
            });

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
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
            async Task<ProductDto> ValidateSearchResult(HttpResponseMessage res)
            {
                Assert.Equal(HttpStatusCode.OK, res.StatusCode);

                var foundProducts = await res.Content.DeserializeJsonObject<ProductSuggestion[]>(_serializer);
                var foundProduct = Assert.Single(foundProducts);
                var productSearchResult = Assert.IsType<ProductSuggestion>(foundProduct);
                Assert.Equal(product.Code, productSearchResult.Product.Code);
                Assert.Equal(product.DefaultServing, productSearchResult.Product.DefaultServing);
                Assert.Equal(product.Tags, productSearchResult.Product.Tags);
                Assert.Equal(product.NutritionalInfo, productSearchResult.Product.NutritionalInfo);
                Assert.Equal(Assert.Single(product.Label).Value, Assert.Single(productSearchResult.Product.Label).Value);

                return productSearchResult.Product;
            }

            response = await _client.GetAsync("/api/v1/products/search?term=Haf");
            await ValidateSearchResult(response);

            // 4. Get product by code
            response = await _client.GetAsync("/api/v1/products/search?barcode=abc");
            var productInfo = await ValidateSearchResult(response);

            // 5. Suggest product contribution
            var contribution = await CreateProductContribution(productInfo.Id);

            // 6. Vote for contribution
            for (int i = 0; i < 9; i++)
            {
                await VoteContribution(contribution.Id, true);
            }

            // check if contribution is applied
            response = await _client.GetAsync("/api/v1/products/search?barcode=zdf");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var newProduct = await response.Content.DeserializeJsonObject<ProductSuggestion[]>(_serializer);
            Assert.Empty(newProduct);

            await VoteContribution(contribution.Id, true);

            response = await _client.GetAsync("/api/v1/products/search?barcode=zdf");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            newProduct = await response.Content.DeserializeJsonObject<ProductSuggestion[]>(_serializer);
            Assert.Single(newProduct);
        }
    }
}
