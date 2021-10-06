using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using CommunityCatalog.Core;
using CommunityCatalog.Core.Dto;
using CommunityCatalog.IntegrationTests._Helpers;
using CommunityCatalog.IntegrationTests.Extensions;
using CommunityCatalog.Models.Response;
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

        public static async Task<IReadOnlyList<Product>> GetAllProducts(HttpClient client)
        {
            var response = await client.GetAsync("api/v1/product/index.json");
            await ThrowOnError(response);

            var result = await response.Content.ReadFromJsonAsync<IReadOnlyList<RepositoryReference>>() ??
                         throw new InvalidOperationException("Result must not be null");

            var repository = result.Single();
            response = await client.GetAsync(repository.Url);

            var products = await response.EnsureSuccessStatusCode().Content
                .ReadFromJsonNetAsync<IReadOnlyList<Product>>();
            if (products == null) throw new InvalidOperationException("Products must not be null");

            return products;
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
