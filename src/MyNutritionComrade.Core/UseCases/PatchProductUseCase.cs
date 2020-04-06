using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Microsoft.Extensions.Logging;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Core.Utilities;
using Newtonsoft.Json;

namespace MyNutritionComrade.Core.UseCases
{
    public class PatchProductUseCase : UseCaseStatus<PatchProductResponse>, IPatchProductUseCase
    {
        private readonly IUserRepository _userRepository;
        private readonly IProductRepository _productRepository;
        private readonly IProductContributionRepository _contributionRepository;
        private readonly IObjectPatchFactory _patchFactory;
        private readonly IComponentContext _serviceProvider;
        private readonly IProductPatchValidator _patchValidator;
        private readonly ILogger<PatchProductUseCase> _logger;

        public PatchProductUseCase(IUserRepository userRepository, IProductRepository productRepository, IProductContributionRepository contributionRepository,
            IObjectPatchFactory patchFactory, IComponentContext serviceProvider, IProductPatchValidator patchValidator, ILogger<PatchProductUseCase> logger)
        {
            _userRepository = userRepository;
            _productRepository = productRepository;
            _contributionRepository = contributionRepository;
            _patchFactory = patchFactory;
            _serviceProvider = serviceProvider;
            _patchValidator = patchValidator;
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
                var copied = _patchFactory.Copy(product);

                try
                {
                    _patchFactory.ExecutePatch(operation.Yield(), copied);
                }
                catch (Exception e)
                {
                    _logger.LogDebug(e, "Applying patch operation {@operation} failed.", operation);
                    return ReturnError(new FieldValidationError("patchOperations", $"Applying patch operation {operation.Type}::{operation.Path} failed."));
                }

                if (!_patchFactory.Compare(product, copied))
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
                await _contributionRepository.Add(contribution);

                var applyUseCase = _serviceProvider.Resolve<IApplyProductContributionUseCase>();
                await applyUseCase.Handle(new ApplyProductContributionRequest(contribution, product, "Immediately executed patch"));
                if (applyUseCase.HasError)
                    return ReturnError(applyUseCase.Error!);

                return new PatchProductResponse();
            }

            var groupedPatches = _patchFactory.GroupPatches(operations).ToList();
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
                    var voteUseCase = _serviceProvider.Resolve<IVoteProductContributionUseCase>();
                    await voteUseCase.Handle(new VoteProductContributionRequest(user.Id, existingContribution.Id, true));
                }
            }

            return new PatchProductResponse();
        }
    }
}
