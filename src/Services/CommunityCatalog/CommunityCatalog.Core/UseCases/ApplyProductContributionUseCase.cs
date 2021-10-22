using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Errors;
using CommunityCatalog.Core.Extensions;
using CommunityCatalog.Core.Gateways.Repos;
using CommunityCatalog.Core.Gateways.Transactions;
using CommunityCatalog.Core.Requests;
using MediatR;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using MyNutritionComrade.Models;
using MyNutritionComrade.Models.Validation;
using Newtonsoft.Json.Linq;

namespace CommunityCatalog.Core.UseCases
{
    public class ApplyProductContributionUseCase : IRequestHandler<ApplyProductContributionRequest>
    {
        private readonly IProductContributionRepository _contributionRepository;
        private readonly IProductRepository _productRepository;
        private readonly IProductUpdateTransaction _productUpdateTransaction;
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public ApplyProductContributionUseCase(IProductContributionRepository contributionRepository,
            IProductRepository productRepository, IProductUpdateTransaction productUpdateTransaction,
            IMediator mediator, IMapper mapper)
        {
            _contributionRepository = contributionRepository;
            _productRepository = productRepository;
            _productUpdateTransaction = productUpdateTransaction;
            _mediator = mediator;
            _mapper = mapper;
        }


        public async Task<Unit> Handle(ApplyProductContributionRequest request, CancellationToken cancellationToken)
        {
            var contribution = await _contributionRepository.FindById(request.ContributionId);
            if (contribution == null)
                throw ProductContributionError.NotFound(request.ContributionId).ToException();

            if (contribution.Status != ProductContributionStatus.Pending)
                throw ProductContributionError.InvalidStatus().ToException();

            var productDocument = await _productRepository.FindById(contribution.ProductId);
            if (productDocument == null)
                throw ProductError.ProductNotFound(contribution.ProductId).ToException();

            var patchedProduct = ApplyPatch(productDocument.Product, contribution.Operations);
            if (patchedProduct == null)
                throw new FieldValidationError(".", "Must not be null").ToException();

            ValidateProduct(patchedProduct);

            var backupProductProperties = _mapper.Map<ProductProperties>(productDocument.Product);

            var newProductVersion = productDocument.Version + 1;
            var newContribution = contribution.Applied(newProductVersion, request.StatusDescription,
                backupProductProperties);

            var newProductDocument = productDocument with
            {
                Version = newProductVersion,
                Product = Product.FromProperties(patchedProduct, productDocument.Product.Id, DateTimeOffset.UtcNow),
            };

            await _productUpdateTransaction.UpdateProduct(newProductDocument, newContribution, productDocument.Version);

            await RemoveNowInvalidContributions(newProductDocument.Product, newProductDocument.Version);

            return Unit.Value;
        }

        private async Task RemoveNowInvalidContributions(Product product, int version)
        {
            var contributions = await _contributionRepository.GetActiveContributions(product.Id);

            foreach (var contribution in contributions)
            {
                var patched = ApplyPatch(product, contribution.Operations);
                try
                {
                    ValidateProduct(patched ?? throw new InvalidOperationException("Product is null"));
                    continue;
                }
                catch (Exception)
                {
                    // ignored
                }

                await _mediator.Send(new RejectProductContributionRequest(contribution.Id,
                    $"Automatically rejected because invalid after version {version}"));
            }
        }

        private static ProductProperties? ApplyPatch(ProductProperties product, IReadOnlyList<Operation> operations)
        {
            var productDocument = JToken.FromObject(product);

            var patchDocument = new JsonPatchDocument(operations.ToList(), JsonConfig.Default.ContractResolver);
            patchDocument.ApplyToWithDefaultOptions(productDocument);

            return productDocument.ToObject<ProductProperties>();
        }

        private static void ValidateProduct(ProductProperties product)
        {
            var validator = new ProductPropertiesValidator();
            var validationResult = validator.Validate(product);
            if (!validationResult.IsValid)
                throw validationResult.ToError().ToException();
        }
    }
}
