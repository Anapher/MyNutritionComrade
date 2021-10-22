using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using CommunityCatalog.Core;
using CommunityCatalog.Core.Dto;
using CommunityCatalog.Core.Response;
using CommunityCatalog.IntegrationTests._Helpers;
using CommunityCatalog.IntegrationTests.Extensions;
using CommunityCatalog.Models.Request;
using CommunityCatalog.Models.Response;
using Microsoft.AspNetCore.JsonPatch.Operations;
using MyNutritionComrade.Models;
using MyNutritionComrade.Models.Index;

namespace CommunityCatalog.IntegrationTests
{
    public static class Api
    {
        public static async Task<string> CreateProduct(HttpClient client, ProductProperties product)
        {
            var response = await client.PostAsync("api/v1/product", JsonNetContent.Create(product));
            await ThrowOnError(response);

            var dto = await response.Content.ReadFromJsonNetAsync<ProductCreatedDto>();
            if (dto?.ProductId == null) throw new InvalidOperationException("Product id must not be null");

            return dto.ProductId;
        }

        public static async Task<IReadOnlyList<ProductCatalogReference>> GetAllRepositories(HttpClient client)
        {
            var response = await client.GetAsync("api/v1/product/index.json");
            await ThrowOnError(response);

            return await response.Content.ReadFromJsonAsync<IReadOnlyList<ProductCatalogReference>>() ??
                   throw new InvalidOperationException("Result must not be null");
        }

        public static async Task<IReadOnlyList<Product>> GetAllProducts(HttpClient client)
        {
            var repositories = await GetAllRepositories(client);

            var repository = repositories.Single();

            var response = await client.GetAsync(repository.Url);
            await ThrowOnError(response);

            var products = await response.Content.ReadFromJsonNetAsync<IReadOnlyList<Product>>();
            if (products == null) throw new InvalidOperationException("Products must not be null");

            return products;
        }

        public static async Task<IReadOnlyList<ProductContributionDto>> GetProductContributions(HttpClient client,
            string productId)
        {
            var response = await client.GetAsync($"api/v1/product/{productId}/contributions");
            await ThrowOnError(response);

            var result = await response.Content.ReadFromJsonNetAsync<IReadOnlyList<ProductContributionDto>>() ??
                         throw new InvalidOperationException("Result must not be null");

            return result;
        }

        public static async Task<IReadOnlyList<string>> PatchProduct(HttpClient client, string productId,
            IReadOnlyList<Operation> operations)
        {
            var response = await client.PatchAsync($"api/v1/product/{productId}", JsonNetContent.Create(operations));
            await ThrowOnError(response);

            return await response.Content.ReadFromJsonNetAsync<IReadOnlyList<string>>() ??
                   throw new InvalidOperationException("Result must not be null");
        }

        public static async Task VoteProductContribution(HttpClient client, string productId, string contributionId,
            bool approve)
        {
            var response = await client.PostAsync($"api/v1/product/{productId}/contributions/{contributionId}/vote",
                JsonNetContent.Create(new VoteContributionRequestDto(approve)));
            await ThrowOnError(response);
        }

        private static async Task<HttpResponseMessage> ThrowOnError(HttpResponseMessage message)
        {
            if (!message.IsSuccessStatusCode)
            {
                Error error;
                try
                {
                    error = await message.Content.ReadFromJsonNetAsync<Error>() ?? throw new Exception();
                }
                catch (Exception)
                {
                    message.EnsureSuccessStatusCode();
                    throw new NotSupportedException("wtf");
                }

                throw new IdErrorException(error);
            }

            return message;
        }
    }
}
