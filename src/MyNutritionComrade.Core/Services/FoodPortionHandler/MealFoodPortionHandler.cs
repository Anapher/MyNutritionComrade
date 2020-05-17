using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Dto;
using MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.Services.FoodPortionHandler
{
    public class MealFoodPortionHandler : IFoodPortionHandler<MealFoodPortionCreationDto>
    {
        private readonly IMealRepository _mealRepository;
        private readonly IServiceProvider _serviceProvider;

        public MealFoodPortionHandler(IMealRepository mealRepository, IServiceProvider serviceProvider)
        {
            _mealRepository = mealRepository;
            _serviceProvider = serviceProvider;
        }

        public async ValueTask<SuccessOrError<FoodPortion>> Create(MealFoodPortionCreationDto creationDto, string userId)
        {
            var meal = await _mealRepository.FindById(creationDto.MealId);
            if (meal == null || meal.UserId != userId)
                return new SuccessOrError<FoodPortion>(new EntityNotFoundError("The meal was not found.", ErrorCode.Meal_NotFound));

            var flattenProducts = new List<FoodPortionItem>();

            if (creationDto.OverwriteIngredients != null)
            {
                if (creationDto.OverwriteIngredients.Any(x => !(x is ProductFoodPortionCreationDto) && !(x is CustomFoodPortionCreationDto)))
                    return new SuccessOrError<FoodPortion>(new FieldValidationError(nameof(creationDto.OverwriteIngredients),
                        "The overwritten ingredients must be products or custom foods."));

                foreach (var dto in creationDto.OverwriteIngredients)
                {
                    var serviceResult = await _serviceProvider.CreateFoodPortion(dto, userId);
                    if (!serviceResult.Succeeded)
                        return new SuccessOrError<FoodPortion>(serviceResult.Response!);

                    flattenProducts.Add((FoodPortionItem) serviceResult.Response!);
                }
            }
            else
            {
                var error = await Flatten(meal.Items, creationDto.Portion, userId, flattenProducts);
                if (error != null)
                    return new SuccessOrError<FoodPortion>(error);
            }

            var nutrients = flattenProducts.Select(x => x.NutritionalInfo).SumNutrition();
            var result = new FoodPortionMeal(nutrients, meal.Id, creationDto.Portion, meal.Name, flattenProducts);
            return new SuccessOrError<FoodPortion>(result);
        }

        private async ValueTask<Error?> Flatten(IEnumerable<FoodPortion> foods, double portion, string userId, List<FoodPortionItem> foodPortions)
        {
            foreach (var food in foods)
            {
                if (food is FoodPortionCustom customFood)
                {
                    foodPortions.Add(new FoodPortionCustom(customFood.NutritionalInfo.ChangeVolume(customFood.NutritionalInfo.Volume * portion),
                        customFood.Label));
                    continue;
                }

                if (food is FoodPortionProduct productFood)
                {
                    var newAmount = productFood.Amount * portion;
                    var newNutritionalInfo = productFood.NutritionalInfo.ChangeVolume(productFood.NutritionalInfo.Volume * portion);

                    foodPortions.Add(new FoodPortionProduct(productFood.ProductId, newNutritionalInfo, productFood.ServingType, newAmount));
                    continue;
                }

                if (food is FoodPortionMeal mealPortion)
                {
                    var mealChild = await _mealRepository.FindById(mealPortion.MealId);
                    if (mealChild == null || mealChild.UserId != userId)
                        return new EntityNotFoundError("The meal was not found.", ErrorCode.Meal_NotFound);

                    var result = await Flatten(mealChild.Items, portion, userId, foodPortions);
                    if (result != null) return result;
                    continue;
                }

                if (food is FoodPortionSuggestion suggestion)
                {
                    var result = await Flatten(suggestion.Items, portion, userId, foodPortions);
                    if (result != null) return result;
                    continue;
                }
            }

            return null;
        }
    }
}
