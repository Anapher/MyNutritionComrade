using System;
using System.Collections.Immutable;
using System.Threading;
using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Extensions;
using CommunityCatalog.Core.Gateways.Repos;
using CommunityCatalog.Core.Requests;
using CommunityCatalog.Core.Response;
using MediatR;
using Microsoft.AspNetCore.JsonPatch.Operations;
using MyNutritionComrade.Models;

namespace CommunityCatalog.Core.UseCases
{
    public class CreateProductUseCase : IRequestHandler<CreateProductRequest, CreateProductResponse>
    {
        private readonly IProductRepository _productRepository;
        private readonly IProductContributionRepository _contributionRepository;

        public CreateProductUseCase(IProductRepository productRepository,
            IProductContributionRepository contributionRepository)
        {
            _productRepository = productRepository;
            _contributionRepository = contributionRepository;
        }

        public async Task<CreateProductResponse> Handle(CreateProductRequest request,
            CancellationToken cancellationToken)
        {
            var (userId, productProperties, mirrorInfo) = request;

            var version = 1;
            var product = MapProductPropertiesToProduct(productProperties);
            var entity = new ProductDocument(product, version, DateTimeOffset.UtcNow, mirrorInfo);

            try
            {
                await _productRepository.Add(entity);
            }
            catch (Exception)
            {
                if (product.Code != null)
                {
                    var existingProduct = await _productRepository.FindByCode(product.Code);
                    if (existingProduct != null)
                        throw ProductError.ProductWithEqualCodeAlreadyExists(product.Code, existingProduct.Product.Id)
                            .ToException();
                }

                throw;
            }

            await CreateInitialContribution(userId, product.Id, version);

            return new CreateProductResponse(product.Id);
        }

        private async Task CreateInitialContribution(string userId, string productId, int version)
        {
            var contribution = ProductContribution.Create(userId, productId, ImmutableList<Operation>.Empty)
                .Initialized(version, "Create product");
            await _contributionRepository.Add(contribution);
        }

        private static Product MapProductPropertiesToProduct(ProductProperties properties)
        {
            var productId = Guid.NewGuid().ToString("N");
            return Product.FromProperties(properties, productId, DateTimeOffset.UtcNow);
        }
    }
}
