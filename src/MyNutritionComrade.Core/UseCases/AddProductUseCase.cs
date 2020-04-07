using System;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Core.Interfaces.UseCases;

namespace MyNutritionComrade.Core.UseCases
{
    public class AddProductUseCase : UseCaseStatus<AddProductResponse>, IAddProductUseCase
    {
        private readonly IApplyProductContributionUseCase _applyProductContributionUseCase;
        private readonly IObjectManipulationUtils _manipulationUtils;
        private readonly IProductRepository _productRepository;
        private readonly IUserRepository _userRepository;

        public AddProductUseCase(IProductRepository productRepository, IUserRepository userRepository, IObjectManipulationUtils manipulationUtils,
            IApplyProductContributionUseCase applyProductContributionUseCase)
        {
            _productRepository = productRepository;
            _userRepository = userRepository;
            _manipulationUtils = manipulationUtils;
            _applyProductContributionUseCase = applyProductContributionUseCase;
        }

        public async Task<AddProductResponse?> Handle(AddProductRequest message)
        {
            var user = await _userRepository.FindById(message.UserId);
            if (user == null)
                return ReturnError(new EntityNotFoundError($"The user with id {message.UserId} was not found.", ErrorCode.UserNotFound));

            var productId = Guid.NewGuid().ToString("N");
            var product = new Product(productId);

            var patch = _manipulationUtils.CreatePatch(product, message.Product);
            var contribution = new ProductContribution(user.Id, productId, patch);

            await _applyProductContributionUseCase.Handle(new ApplyProductContributionRequest(contribution, product, "Initialize product", false));
            if (_applyProductContributionUseCase.HasError)
                return ReturnError(_applyProductContributionUseCase.Error!);

            if (!await _productRepository.Add(product, contribution))
                return ReturnError(new InvalidOperationError("A product with an equal code already exists.", ErrorCode.Product_CodeAlreadyExists));

            return new AddProductResponse(product);
        }
    }
}
