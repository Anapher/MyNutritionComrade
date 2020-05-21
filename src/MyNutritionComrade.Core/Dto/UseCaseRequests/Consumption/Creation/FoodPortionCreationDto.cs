using MyNutritionComrade.Core.Domain.Entities.Consumption;
using Newtonsoft.Json;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation
{
    public abstract class FoodPortionCreationDto
    {
        [JsonProperty]
        public abstract FoodPortionType Type { get; }
    }
}
