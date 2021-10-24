using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Gateways.Services;
using CommunityCatalog.Core.Requests;
using MediatR;
using Microsoft.Extensions.Logging;
using MyNutritionComrade.Models;

namespace CommunityCatalog.Core.UseCases
{
    public class SynchronizeMirrorsUseCase : IRequestHandler<SynchronizeMirrorsRequest>
    {
        private readonly IMirrorClient _mirrorClient;
        private readonly IMediator _mediator;
        private readonly ILogger<SynchronizeMirrorsUseCase> _logger;

        public SynchronizeMirrorsUseCase(IMirrorClient mirrorClient, IMediator mediator,
            ILogger<SynchronizeMirrorsUseCase> logger)
        {
            _mirrorClient = mirrorClient;
            _mediator = mediator;
            _logger = logger;
        }

        public async Task<Unit> Handle(SynchronizeMirrorsRequest request, CancellationToken cancellationToken)
        {
            if (!request.Mirrors.Any())
            {
                _logger.LogDebug("Requested to synchronize mirrors, but no mirrors were found");
            }

            foreach (var mirror in request.Mirrors)
            {
                _logger.LogDebug("Synchronize mirror {url}", mirror.IndexUrl);
                try
                {
                    await SynchronizeMirror(mirror);
                }
                catch (Exception e)
                {
                    _logger.LogWarning(e, "Error synchronizing index {url}", mirror.IndexUrl);
                }
            }

            return Unit.Value;
        }

        private async Task SynchronizeMirror(ProductIndexMirror mirror)
        {
            var catalogs = await _mirrorClient.FetchCatalogsFromIndex(mirror.IndexUrl);

            _logger.LogDebug("Found {count} catalogs", catalogs.Count);

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

            _logger.LogDebug("Synchronize {count} products from catalog {catalogUrl}", products.Count, url);

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
    }
}
