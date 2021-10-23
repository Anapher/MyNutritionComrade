using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CommunityCatalog.Core.Requests;
using CommunityCatalog.Infrastructure.Mirrors;
using CommunityCatalog.Options;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MyNutritionComrade.Models;

namespace CommunityCatalog.Services
{
    public class MirrorSynchronizer : PeriodicBackgroundJob
    {
        private readonly IMirrorClient _mirrorClient;
        private readonly IMediator _mediator;
        private readonly ILogger<MirrorSynchronizer> _logger;
        private readonly MirrorOptions _options;

        public MirrorSynchronizer(IOptions<MirrorOptions> options, IMirrorClient mirrorClient, IMediator mediator,
            ILogger<MirrorSynchronizer> logger)
        {
            _mirrorClient = mirrorClient;
            _mediator = mediator;
            _logger = logger;
            _options = options.Value;
        }

        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Begin synchronizing mirrors...");

            foreach (var mirror in _options.Indexes)
            {
                try
                {
                    await SynchronizeMirror(mirror);
                }
                catch (Exception e)
                {
                    _logger.LogWarning(e, "Error synchronizing index {url}", mirror.IndexUrl);
                }
            }
        }

        private async Task SynchronizeMirror(ProductIndexMirror mirror)
        {
            var catalogs = await _mirrorClient.FetchCatalogsFromIndex(mirror.IndexUrl);

            foreach (var catalogReference in catalogs)
            {
                var catalogUrl = BuildProductCatalogUrl(mirror.IndexUrl, catalogReference.Url);
                try
                {
                    await SynchronizeCatalog(catalogUrl, mirror.IndexUrl,
                        !mirror.WriteableCatalogs.Contains(catalogReference.Url));
                }
                catch (Exception e)
                {
                    _logger.LogWarning(e, "Error synchronizing catalog {url}", catalogUrl);
                }
            }
        }

        private async Task SynchronizeCatalog(string url, string indexUrl, bool readOnly)
        {
            var products = await _mirrorClient.FetchProductsFromCatalog(url);

            foreach (var product in products)
            {
                try
                {
                    await SynchronizeProduct(product, indexUrl, readOnly);
                }
                catch (Exception e)
                {
                    _logger.LogWarning(e, "Error synchronizing product {productId}", product.Id);
                }
            }
        }

        private async Task SynchronizeProduct(Product product, string indexUrl, bool readOnly)
        {
            await _mediator.Send(new SynchronizeProductRequest(product, indexUrl, readOnly));
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
