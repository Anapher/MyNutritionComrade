#pragma warning disable 8618

using System.Collections.Generic;
using MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class CreateMealRequest : IUseCaseRequest<CreateMealResponse>
    {
        public CreateMealRequest(CreateMealDto dto, string userId)
        {
            Dto = dto;
            UserId = userId;
        }

        public string UserId { get; }
        public CreateMealDto Dto { get; }
    }

    public class CreateMealDto
    {
        public string Name { get; set; }
        public List<FoodPortionCreationDto> Items { get; set; }
    }
}
