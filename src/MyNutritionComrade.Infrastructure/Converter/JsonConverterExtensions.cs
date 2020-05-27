using System;
using System.Collections.Generic;
using MyNutritionComrade.Core.Domain.Entities.Account;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Domain.Entities.Goal;
using MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation;
using Newtonsoft.Json;

namespace MyNutritionComrade.Infrastructure.Converter
{
    public static class JsonConverterExtensions
    {
        public static void AddRequiredConverters(this IList<JsonConverter> converters)
        {
            converters.Add(new ServingTypeJsonConverter());
            converters.Add(new PatchOperationJsonConverter());

            converters.Add(new AbstractTypeJsonConverter<NutritionGoalBase, NutritionGoalType>(new Dictionary<NutritionGoalType, Type>
            {
                {NutritionGoalType.CaloriesFixed, typeof(CaloriesFixedNutritionGoal)},
                {NutritionGoalType.CaloriesMifflinStJeor, typeof(CaloriesMifflinStJeorNutritionGoal)},
                {NutritionGoalType.ProteinByBodyweight, typeof(ProteinByBodyweightNutritionGoal)},
                {NutritionGoalType.ProteinFixed, typeof(ProteinFixedNutritionGoal)},
                {NutritionGoalType.ProportionalDistribution, typeof(NutrientDistribution)}
            }) {TypePropertyName = nameof(NutritionGoalBase.Type)});

            converters.Add(new AbstractTypeJsonConverter<UserMetadata, UserType>(
                new Dictionary<UserType, Type> {{UserType.Google, typeof(GoogleUserMetadata)}, {UserType.Custom, typeof(CustomUserMetadata)},}, false)
            {
                TypePropertyName = nameof(UserMetadata.UserType)
            });

            converters.Add(new AbstractTypeJsonConverter<FoodPortion, FoodPortionType>(new Dictionary<FoodPortionType, Type>
            {
                {FoodPortionType.Meal, typeof(FoodPortionMeal)},
                {FoodPortionType.Product, typeof(FoodPortionProduct)},
                {FoodPortionType.Suggestion, typeof(FoodPortionSuggestion)},
                {FoodPortionType.Custom, typeof(FoodPortionCustom)},
            }) {TypePropertyName = nameof(FoodPortion.Type)});

            converters.Add(new AbstractTypeJsonConverter<FoodPortionCreationDto, FoodPortionType>(new Dictionary<FoodPortionType, Type>
            {
                {FoodPortionType.Product, typeof(ProductFoodPortionCreationDto)},
                {FoodPortionType.Meal, typeof(MealFoodPortionCreationDto)},
                {FoodPortionType.Custom, typeof(CustomFoodPortionCreationDto)},
                {FoodPortionType.Suggestion, typeof(SuggestionFoodPortionCreationDto)},
            }) {TypePropertyName = nameof(FoodPortionCreationDto.Type)});
        }
    }
}
