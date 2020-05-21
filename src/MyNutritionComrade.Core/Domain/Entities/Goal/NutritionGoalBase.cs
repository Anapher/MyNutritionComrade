using Newtonsoft.Json;

namespace MyNutritionComrade.Core.Domain.Entities.Goal
{
    public abstract class NutritionGoalBase
    {
        [JsonProperty]
        public abstract NutritionGoalType Type { get; }
    }
}
