using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Extensions;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Core.Interfaces.UseCases;
using Newtonsoft.Json;

namespace MyNutritionComrade.Core.UseCases
{
    public class PatchProductUseCase : UseCaseStatus<PatchProductResponse>, IPatchProductUseCase
    {
        private readonly IUserRepository _userRepository;
        private readonly IProductRepository _productRepository;
        private readonly IProductContributionRepository _contributionRepository;
        private readonly IObjectManipulationUtils _manipulationUtils;
        private readonly IServiceProvider _serviceProvider;
        private readonly IProductPatchValidator _patchValidator;
        private readonly IProductPatchGrouper _productPatchGrouper;
        private readonly ILogger<PatchProductUseCase> _logger;

        public PatchProductUseCase(IUserRepository userRepository, IProductRepository productRepository, IProductContributionRepository contributionRepository,
            IObjectManipulationUtils manipulationUtils, IServiceProvider serviceProvider, IProductPatchValidator patchValidator,
            IProductPatchGrouper productPatchGrouper, ILogger<PatchProductUseCase> logger)
        {
            _userRepository = userRepository;
            _productRepository = productRepository;
            _contributionRepository = contributionRepository;
            _manipulationUtils = manipulationUtils;
            _serviceProvider = serviceProvider;
            _patchValidator = patchValidator;
            _productPatchGrouper = productPatchGrouper;
            _logger = logger;
        }

        public async Task<PatchProductResponse?> Handle(PatchProductRequest message)
        {
            var user = await _userRepository.FindById(message.UserId);
            if (user == null)
                return ReturnError(new EntityNotFoundError($"The user with id {message.UserId} was not found.", ErrorCode.UserNotFound));

            var product = await _productRepository.FindById(message.ProductId);
            if (product == null)
                return ReturnError(new EntityNotFoundError($"The product with id {message.ProductId} was not found.", ErrorCode.Product_NotFound));

            var operations = new List<PatchOperation>();
            foreach (var operation in message.PatchOperations)
            {
                var copied = _manipulationUtils.Clone<ProductInfo>(product);

                try
                {
                    _manipulationUtils.ExecutePatch(operation.Yield(), copied);
                }
                catch (Exception e)
                {
                    _logger.LogDebug(e, "Applying patch operation {@operation} failed.", operation);
                    return ReturnError(new FieldValidationError("patchOperations", $"Applying patch operation {operation.Type}::{operation.Path} failed."));
                }

                if (!_manipulationUtils.Compare(product, copied))
                {
                    // if the patch operation actually changed something
                    operations.Add(operation);
                }
            }

            // all provided operations were already applied
            if(!operations.Any())
                return new PatchProductResponse();

            if (user.IsTrustworthy)
            {
                var contribution = new ProductContribution(user.Id, product.Id, operations);
                if (!await _contributionRepository.Add(contribution))
                    return ReturnError(new RaceConditionError("The product contribution could not be added", ErrorCode.ProductContribution_CreationFailed));

                var applyUseCase = _serviceProvider.GetRequiredService<IApplyProductContributionUseCase>();
                await applyUseCase.Handle(new ApplyProductContributionRequest(contribution, product, "Immediately executed patch"));
                if (applyUseCase.HasError)
                {
                    await _contributionRepository.Remove(contribution);
                    return ReturnError(applyUseCase.Error!);
                }

                return new PatchProductResponse();
            }

            var groupedPatches = _productPatchGrouper.GroupPatch(operations).ToList();
            foreach (var patchGroup in groupedPatches)
            {
                var result = _patchValidator.Validate(patchGroup, product);
                if (!result.IsValid)
                {
                    return ReturnError(new ValidationResultError(result, $"Patches: {JsonConvert.SerializeObject(patchGroup)}", ErrorCode.Product_Validation));
                }
            }

            foreach (var patchGroup in groupedPatches)
            {
                var contribution = new ProductContribution(user.Id, product.Id, patchGroup);
                if (!await _contributionRepository.Add(contribution))
                {
                    var existingContribution = await _contributionRepository.FindByPatchHash(contribution.ProductId, contribution.PatchHash);
                    if (existingContribution == null)
                    {
                        _logger.LogDebug(
                            "It was not possible to create the patch with hash {hash} for product {productId}, but there was also active contribution found. This may be because of a race condition.",
                            contribution.PatchHash, contribution.ProductId);
                        continue;
                    }

                    // the contribution already exists. We add a vote to the existing contribution
                    var voteUseCase = _serviceProvider.GetRequiredService<IVoteProductContributionUseCase>();
                    await voteUseCase.Handle(new VoteProductContributionRequest(user.Id, existingContribution.Id, true));
                }
            }

            return new PatchProductResponse();
        }
    }
}
