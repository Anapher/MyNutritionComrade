#pragma warning disable 1998

using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Domain.Validation;
using MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation;
using MyNutritionComrade.Core.Errors;

namespace MyNutritionComrade.Core.Services.FoodPortionHandler
{
    public class CustomFoodPortionHandler : IFoodPortionHandler<CustomFoodPortionCreationDto>
    {
        public async ValueTask<SuccessOrError<FoodPortion>> Create(CustomFoodPortionCreationDto creationDto, string userId)
        {
            var validation = new NutritionalInfoValidator().Validate(creationDto.NutritionalInfo);
            if (!validation.IsValid)
                return new SuccessOrError<FoodPortion>(new ValidationResultError(validation, "Invalid nutritional info."));

            var result = new FoodPortionCustom(creationDto.NutritionalInfo, creationDto.Label);
            return new SuccessOrError<FoodPortion>(result);
        }
    }
}
