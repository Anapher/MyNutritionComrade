using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using CommunityCatalog.Core;
using CommunityCatalog.Core.Requests;
using CommunityCatalog.Extensions;
using CommunityCatalog.Infrastructure.Mirrors;
using CommunityCatalog.Options;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MyNutritionComrade.Models;
using MyNutritionComrade.Models.Index;

namespace CommunityCatalog.Services
{
    public class MirrorSynchronizer : PeriodicBackgroundJob
    {
        private readonly IMediator _mediator;
        private readonly ILogger<MirrorSynchronizer> _logger;
        private readonly MirrorOptions _options;
        private readonly HttpClient _httpClient;

        public MirrorSynchronizer(IOptions<MirrorOptions> options, IHttpClientFactory httpClientFactory,
            IMediator mediator, ILogger<MirrorSynchronizer> logger)
        {
            _mediator = mediator;
            _logger = logger;
            _options = options.Value;
            _httpClient = httpClientFactory.CreateClient();
        }

        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Begin synchronizing mirrors...");

            foreach (var mirror in _options.Indexes)
            {
                await SynchronizeMirror(mirror);
            }
        }

        private async Task SynchronizeMirror(ProductIndexMirror mirror)
        {
            var request = await _httpClient.GetAsync(mirror.IndexUrl);
            var catalogs = await request.EnsureSuccessStatusCode().Content
                .ReadFromJsonAsync<IReadOnlyList<ProductCatalogReference>>();

            if (catalogs == null) throw new InvalidOperationException("Catalog list must not be null");

            foreach (var catalogReference in catalogs)
            {
                var catalogUrl = BuildProductCatalogUrl(mirror.IndexUrl, catalogReference.Url);
                try
                {
                    await SynchronizeCatalog(catalogUrl, mirror.IndexUrl);
                }
                catch (Exception e)
                {
                    _logger.LogWarning(e, "Error synchronizing catalog {url}", catalogUrl);
                }
            }
        }

        private async Task SynchronizeCatalog(string url, string indexUrl)
        {
            var request = await _httpClient.GetAsync(url, HttpCompletionOption.ResponseHeadersRead);
            var products = await request.EnsureSuccessStatusCode().Content
                .ReadFromJsonNetAsync<IReadOnlyList<Product>>(JsonConfig.DefaultSerializer);

            if (products == null) throw new InvalidOperationException("Product list must not be null");

            foreach (var product in products)
            {
                try
                {
                    await SynchronizeProduct(product, indexUrl);
                }
                catch (Exception e)
                {
                    _logger.LogWarning(e, "Error synchronizing product {productId}", product.Id);
                }
            }
        }

        private async Task SynchronizeProduct(Product product, string indexUrl)
        {
            await _mediator.Send(new SynchronizeProductRequest(product, indexUrl));
        }

        private static string BuildProductCatalogUrl(string mirrorIndexUrl, string catalogUrl)
        {
            if (IsUrlAbsolute(catalogUrl)) return catalogUrl;
            return mirrorIndexUrl + "/" + catalogUrl;
        }

        private static bool IsUrlAbsolute(string url)
        {
            return Uri.TryCreate(url, UriKind.Absolute, out _);
        }

        protected override DateTimeOffset GetNextExecutionTime()
        {
            return DateTimeOffset.UtcNow + _options.PollFrequency;
        }
    }
}
