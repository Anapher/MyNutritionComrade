using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Domain.Validation;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Core.Interfaces.UseCases;

namespace MyNutritionComrade.Core.UseCases
{
    public class ApplyProductContributionUseCase : UseCaseStatus<ApplyProductContributionResponse>, IApplyProductContributionUseCase
    {
        private readonly IProductContributionRepository _contributionRepository;
        private readonly ILogger<ApplyProductContributionUseCase> _logger;
        private readonly IObjectManipulationUtils _manipulationUtils;
        private readonly IProductPatchValidator _patchValidator;
        private readonly IProductRepository _productRepository;

        public ApplyProductContributionUseCase(IProductRepository productRepository, IProductContributionRepository contributionRepository,
            IObjectManipulationUtils manipulationUtils, IProductPatchValidator patchValidator, ILogger<ApplyProductContributionUseCase> logger)
        {
            _productRepository = productRepository;
            _contributionRepository = contributionRepository;
            _manipulationUtils = manipulationUtils;
            _patchValidator = patchValidator;
            _logger = logger;
        }

        public async Task<ApplyProductContributionResponse?> Handle(ApplyProductContributionRequest message)
        {
            var contribution = message.Contribution;
            if (contribution.Status != ProductContributionStatus.Pending)
                return ReturnError(new InvalidOperationError(
                    $"The status of the contribution must be {ProductContributionStatus.Pending}, but it is {contribution.Status}",
                    ErrorCode.ProductContribution_InvalidStatus));

            var product = message.Product;
            var sourceVersion = product.Version;

            // execute patch
            try
            {
                _manipulationUtils.ExecutePatch(contribution.Patch, product);
            }
            catch (Exception e)
            {
                _logger.LogError(e,
                    "An error occurred when trying to apply contribution {productContributionId} on product {productId}. That must not happen as all patches should be validated before application.",
                    contribution.Id, contribution.ProductId);
                return ReturnError(new InternalError("The patch could not be applied.", ErrorCode.ProductContribution_PatchExecutionFailed));
            }

            // validate product
            var validationResult = new ProductInfoValidator().Validate(product);
            if (!validationResult.IsValid)
            {
                _logger.LogError(
                    "The validation failed after applying product contribution {productContributionId} on product {productId}. That must not happen as all patches should be validated before application.",
                    contribution.Id, contribution.ProductId);
                return ReturnError(new ValidationResultError(validationResult, "The patch could not be applied.",
                    ErrorCode.ProductContribution_PatchExecutionFailed, null, ErrorType.InternalError));
            }

            // increment version
            var newVersion = product.Version + 1;
            contribution.Apply(newVersion, message.Description);
            product.Version = newVersion;

            if (!message.WriteChanges)
                return new ApplyProductContributionResponse(contribution, product);

            if (!await _productRepository.SaveProductChanges(product, sourceVersion, contribution))
            {
                return ReturnError(new RaceConditionError("The product in the database does not match the product the patch was applied on. Please try again.",
                    ErrorCode.Product_ExecutionRaceCondition));
            }

            // cleanup other contributions, remove contributions that don't have an effect or produce an invalid product
            var activeContributions = await _contributionRepository.GetActiveProductContributions(product.Id);
            foreach (var activeContribution in activeContributions)
            {
                var result = _patchValidator.Validate(activeContribution.Patch, product);
                if (!result.IsValid)
                {
                    activeContribution.Reject($"Patch validation failed: {string.Join(", ", result.Errors)}");
                    if (!await _contributionRepository.UpdateProductContribution(activeContribution))
                    {
                        _logger.LogWarning("Attempting to reject product contribution {id} failed.", activeContribution.Id);
                    }
                }
            }

            return new ApplyProductContributionResponse(contribution, product);
        }
    }
}
