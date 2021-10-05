using System;
using System.Collections.Immutable;
using System.Threading;
using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;
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
            var (userId, productProperties) = request;

            var version = 1;
            var product = MapProductPropertiesToEntity(productProperties, version);

            await _productRepository.Add(product);

            var contribution = ProductContribution.Create(userId, product.Id, ImmutableList<Operation>.Empty)
                .Applied(version, "Create product", ImmutableList<Operation>.Empty);

            await _contributionRepository.Add(contribution);

            return new CreateProductResponse(product.Id);
        }

        private static VersionedProduct MapProductPropertiesToEntity(ProductProperties properties, int version)
        {
            var productId = Guid.NewGuid().ToString("N");

            return new VersionedProduct(version, DateTimeOffset.UtcNow, DateTimeOffset.UtcNow, productId,
                properties.Code, properties.Label, properties.NutritionalInfo, properties.Servings,
                properties.DefaultServing, properties.Tags);
        }
    }
}
