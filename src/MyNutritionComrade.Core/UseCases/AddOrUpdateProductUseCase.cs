using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Core.Utilities;
using Newtonsoft.Json;

namespace MyNutritionComrade.Core.UseCases
{
    public class AddOrUpdateProductUseCase : UseCaseStatus<AddOrUpdateProductResponse>, IAddOrUpdateProductUseCase
    {
        private readonly IProductRepository _productRepository;
        private readonly IUserRepository _userRepository;
        private readonly IJsonPatchUtils _jsonPatchUtils;

        public AddOrUpdateProductUseCase(IProductRepository productRepository, IUserRepository userRepository, IJsonPatchUtils jsonPatchUtils)
        {
            _productRepository = productRepository;
            _userRepository = userRepository;
            _jsonPatchUtils = jsonPatchUtils;
        }

        public async Task<AddOrUpdateProductResponse?> Handle(AddOrUpdateProductRequest message)
        {
            var user = await _userRepository.FindById(message.UserId);
            if (user == null)
                return ReturnError(new EntityNotFoundError($"The user with id {message.UserId} was not found.", ErrorCode.UserNotFound));

            Product? product = null;
            if (message.ProductId != null)
                product = await _productRepository.GetFullProductById(message.ProductId.Value);

            var isCreatingProduct = false;
            if (product == null)
            {
                isCreatingProduct = true;
                product = new Product();
            }

            var sourceProductDto = new ProductDto(product);
            var patch = _jsonPatchUtils.CreatePatch(sourceProductDto, message.ProductDto);
            var patchJson = JsonConvert.SerializeObject(patch);

            var contribution = product.AddContribution(user, message.ProductVersion ?? product.Version, patchJson);
            if (isCreatingProduct || user.IsTrustworthy)
                product.ApplyContribution(contribution, message.ProductDto);

            return new AddOrUpdateProductResponse(product);
        }
    }
}
