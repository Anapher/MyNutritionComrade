using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using CommunityCatalog.Core;
using CommunityCatalog.Extensions;
using MyNutritionComrade.Models;
using MyNutritionComrade.Models.Index;

namespace CommunityCatalog.Services
{
    public class HttpMirrorClient : IMirrorClient
    {
        private readonly HttpClient _httpClient;

        public HttpMirrorClient(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        public async Task<IReadOnlyList<ProductCatalogReference>> FetchCatalogsFromIndex(string indexUrl)
        {
            var request = await _httpClient.GetAsync(indexUrl);
            var catalogs = await request.EnsureSuccessStatusCode().Content
                .ReadFromJsonAsync<IReadOnlyList<ProductCatalogReference>>();

            if (catalogs == null) throw new InvalidOperationException("Catalog list must not be null");

            return catalogs;
        }

        public async Task<IReadOnlyList<Product>> FetchProductsFromCatalog(string catalogUrl)
        {
            var request = await _httpClient.GetAsync(catalogUrl, HttpCompletionOption.ResponseHeadersRead);
            var products = await request.EnsureSuccessStatusCode().Content
                .ReadFromJsonNetAsync<IReadOnlyList<Product>>(JsonConfig.DefaultSerializer);

            if (products == null) throw new InvalidOperationException("Product list must not be null");

            return products;
        }
    }
}
