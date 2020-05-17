using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation;
using MyNutritionComrade.Core.Services.FoodPortionHandler;

namespace MyNutritionComrade.Core.Utilities
{
    public static class FoodPortionUtils
    {
        public static ValueTask<SuccessOrError<FoodPortion>> CreateFoodPortion(this IServiceProvider serviceProvider, FoodPortionCreationDto dto, string userId)
        {
            var serviceType = typeof(IFoodPortionHandler<>).MakeGenericType(dto.GetType());
            var handler = serviceProvider.GetRequiredService(serviceType);

            var method = serviceType.GetMethod(nameof(IFoodPortionHandler<CustomFoodPortionCreationDto>.Create));
            var result = method!.Invoke(handler, new object[] {dto, userId});

            return (ValueTask<SuccessOrError<FoodPortion>>) result!;
        }
    }
}
