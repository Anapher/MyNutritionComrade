using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Gateways.Repos;
using CommunityCatalog.Core.Requests;
using JsonPatchGenerator;
using MediatR;
using MyNutritionComrade.Models;
using Newtonsoft.Json.Linq;

namespace CommunityCatalog.Core.UseCases
{
    public class SynchronizeProductUseCase : IRequestHandler<SynchronizeProductRequest>
    {
        private const string SYSTEM_USERID = "SYSTEM";

        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;

        public SynchronizeProductUseCase(IProductRepository productRepository, IMapper mapper, IMediator mediator)
        {
            _productRepository = productRepository;
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task<Unit> Handle(SynchronizeProductRequest request, CancellationToken cancellationToken)
        {
            var mirrorInfo = CreateMirrorInfo(request);

            var product = await _productRepository.FindById(request.Product.Id);
            if (product == null)
            {
                await AddNewProduct(request, mirrorInfo);
                return Unit.Value;
            }

            if (product.MirrorInfo == null)
            {
                await SetMirrorForProduct(product, mirrorInfo);
                return Unit.Value;
            }

            if (request.IndexUrl != product.MirrorInfo.MirrorIndex)
                throw new InvalidOperationException(
                    $"Product {request.Product.Id} is mirrored by {request.IndexUrl} and {product.MirrorInfo.MirrorIndex}");

            if (request.Product.ModifiedOn > product.MirrorInfo.ProductVersion.ModifiedOn)
            {
                // if the product at the mirror has updated since the last synchronization
                await SetMirrorForProduct(product, mirrorInfo);
                await CreateAndApplyPatchesForProduct(request.Product, product.MirrorInfo.ProductVersion);
                return Unit.Value;
            }

            return Unit.Value;
        }

        private async Task CreateAndApplyPatchesForProduct(Product newMirrorProduct, Product storedMirrorProduct)
        {
            var productId = newMirrorProduct.Id;

            var storedProduct = _mapper.Map<ProductProperties>(storedMirrorProduct);
            var newProduct = _mapper.Map<ProductProperties>(newMirrorProduct);

            var patch = JsonPatchFactory.Create(storedProduct, newProduct, JsonConfig.Default,
                JsonPatchFactory.DefaultOptions);

            if (!patch.Operations.Any())
                return;

            foreach (var operation in patch.Operations)
            {
                if (operation.value is JToken jToken)
                    operation.value = jToken.ToObject<object>();
            }

            var groups =
                await _mediator.Send(new ValidateAndGroupProductContributionsRequest(productId, patch.Operations));

            if (!groups.Any()) return;

            foreach (var patchGroup in groups)
            {
                var contributionId =
                    await _mediator.Send(new CreateProductContributionRequest(SYSTEM_USERID, productId, patchGroup));

                await _mediator.Send(new ApplyProductContributionRequest(contributionId, "Applied patch from mirror"));
            }
        }

        private async Task AddNewProduct(SynchronizeProductRequest request, ProductMirrorInfo mirrorInfo)
        {
            await _mediator.Send(new CreateProductRequest(SYSTEM_USERID, request.Product, mirrorInfo));
        }

        private async Task SetMirrorForProduct(ProductDocument product, ProductMirrorInfo mirrorInfo)
        {
            await _productRepository.Update(product with { MirrorInfo = mirrorInfo });
        }

        private static ProductMirrorInfo CreateMirrorInfo(SynchronizeProductRequest request)
        {
            return new ProductMirrorInfo(request.Product, request.IndexUrl, request.ReadOnly);
        }
    }
}
