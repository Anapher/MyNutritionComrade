using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.Services.FoodPortionHandler
{
    public class ProductFoodPortionHandler : IFoodPortionHandler<ProductFoodPortionCreationDto>
    {
        private readonly IProductRepository _productRepository;

        public ProductFoodPortionHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async ValueTask<SuccessOrError<FoodPortion>> Create(ProductFoodPortionCreationDto creationDto, string userId)
        {
            var product = await _productRepository.FindById(creationDto.ProductId);
            if (product == null)
                return new SuccessOrError<FoodPortion>(new EntityNotFoundError("The product was not found.", ErrorCode.Product_NotFound));

            if (creationDto.Amount <= 0)
                return new SuccessOrError<FoodPortion>(new FieldValidationError(nameof(creationDto.Amount), "The amount must be greater than 0."));

            if (!product.Servings.TryGetValue(creationDto.ServingType, out var servingSize))
                return new SuccessOrError<FoodPortion>(
                    new FieldValidationError(nameof(creationDto.ServingType), $"The product with id {product.Id} does not have a serving of type {creationDto.ServingType}."));

            var newVolume = creationDto.Amount * servingSize;
            var nutritionalInfo = product.NutritionalInfo.ChangeVolume(newVolume);

            var portion = new FoodPortionProduct(product.Id, nutritionalInfo, creationDto.ServingType, creationDto.Amount);
            return new SuccessOrError<FoodPortion>(portion);
        }
    }
}
