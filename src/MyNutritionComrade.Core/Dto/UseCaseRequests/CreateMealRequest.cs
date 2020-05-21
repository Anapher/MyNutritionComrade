#pragma warning disable 8618

using System.Collections.Generic;
using MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class CreateMealRequest : IUseCaseRequest<CreateMealResponse>
    {
        public CreateMealRequest(CreateMealDto dto, string userId, string? overwriteMeal)
        {
            Dto = dto;
            UserId = userId;
            OverwriteMeal = overwriteMeal;
        }

        public string UserId { get; }
        public CreateMealDto Dto { get; }
        public string? OverwriteMeal { get; }
    }

    public class CreateMealDto
    {
        public string Name { get; set; }
        public List<FoodPortionCreationDto> Items { get; set; }
    }
}
