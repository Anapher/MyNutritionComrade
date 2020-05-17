using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.Services.FoodPortionHandler
{
    public class SuggestionFoodPortionHandler : IFoodPortionHandler<SuggestionFoodPortionCreationDto>
    {
        private readonly IServiceProvider _serviceProvider;

        public SuggestionFoodPortionHandler(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async ValueTask<SuccessOrError<FoodPortion>> Create(SuggestionFoodPortionCreationDto creationDto, string userId)
        {
            var flattenProducts = new List<FoodPortion>(); // only Product and Custom

            foreach (var dto in creationDto.Items)
            {
                if (dto is SuggestionFoodPortionCreationDto)
                    return new SuccessOrError<FoodPortion>(new FieldValidationError(nameof(creationDto.Items), "The items must not nest suggestion meals."));

                var serviceResult = await _serviceProvider.CreateFoodPortion(dto, userId);
                if (!serviceResult.Succeeded)
                    return new SuccessOrError<FoodPortion>(serviceResult.Response!);

                flattenProducts.Add(serviceResult.Response!);
            }

            var nutrients = flattenProducts.Select(x => x.NutritionalInfo).SumNutrition();
            var result = new FoodPortionSuggestion(nutrients, creationDto.SuggestionId, flattenProducts);
            return new SuccessOrError<FoodPortion>(result);
        }
    }
}
