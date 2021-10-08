using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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

        public ApplyProductContributionUseCase(IProductContributionRepository contributionRepository,
            IProductRepository productRepository, IProductUpdateTransaction productUpdateTransaction,
            IMediator mediator)
        {
            _contributionRepository = contributionRepository;
            _productRepository = productRepository;
            _productUpdateTransaction = productUpdateTransaction;
            _mediator = mediator;
        }

        public async Task<Unit> Handle(ApplyProductContributionRequest request, CancellationToken cancellationToken)
        {
            var contribution = await _contributionRepository.FindById(request.ContributionId);
            if (contribution == null)
                throw ProductContributionError.NotFound(request.ContributionId).ToException();

            if (contribution.Status != ProductContributionStatus.Pending)
                throw ProductContributionError.InvalidStatus().ToException();

            var product = await _productRepository.FindById(contribution.ProductId);
            if (product == null)
                throw ProductError.ProductNotFound(contribution.ProductId).ToException();

            var patchedProduct = ApplyPatch(product, contribution.Operations);
            if (patchedProduct == null)
                throw new FieldValidationError(".", "Must not be null").ToException();

            ValidateProduct(patchedProduct);

            var newProductVersion = product.Version + 1;
            var newContribution = contribution.Applied(newProductVersion, request.StatusDescription, product);
            var newProduct = product with
            {
                Version = newProductVersion,
                ModifiedOn = DateTimeOffset.UtcNow,

                // copy properties
                Code = patchedProduct.Code,
                Label = patchedProduct.Label,
                NutritionalInfo = patchedProduct.NutritionalInfo,
                Servings = patchedProduct.Servings,
                DefaultServing = patchedProduct.DefaultServing,
                Tags = patchedProduct.Tags,
            };

            await _productUpdateTransaction.UpdateProduct(newProduct, newContribution, product.Version);

            await RemoveNowInvalidContributions(newProduct);

            return Unit.Value;
        }

        private async Task RemoveNowInvalidContributions(VersionedProduct newProduct)
        {
            var contributions = await _contributionRepository.GetActiveContributions(newProduct.Id);

            foreach (var contribution in contributions)
            {
                var patched = ApplyPatch(newProduct, contribution.Operations);
                try
                {
                    ValidateProduct(patched ?? throw new InvalidOperationException("Product is null"));
                }
                catch (Exception)
                {
                    await _mediator.Send(new RejectProductContributionRequest(contribution.Id,
                        $"Automatically rejected because invalid after version {newProduct.Version}"));
                }
            }
        }

        private static ProductProperties? ApplyPatch(ProductProperties product, IReadOnlyList<Operation> operations)
        {
            var productDocument = JToken.FromObject(product);

            var patchDocument = new JsonPatchDocument(operations.ToList(), JsonConfig.Default.ContractResolver);
            patchDocument.ApplyToWithDefaultOptions(productDocument);

            return productDocument.ToObject<ProductProperties>();
        }

        private void ValidateProduct(ProductProperties product)
        {
            var validator = new ProductPropertiesValidator();
            var validationResult = validator.Validate(product);
            if (!validationResult.IsValid)
                throw validationResult.ToError().ToException();
        }
    }
}
