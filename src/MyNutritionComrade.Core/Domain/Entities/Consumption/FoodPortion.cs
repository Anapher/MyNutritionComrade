using Newtonsoft.Json;

namespace MyNutritionComrade.Core.Domain.Entities.Consumption
{
    public abstract class FoodPortion
    {
        protected FoodPortion(NutritionalInfo nutritionalInfo)
        {
            NutritionalInfo = nutritionalInfo;
        }

        public NutritionalInfo NutritionalInfo { get; set; }

        [JsonProperty]
        public abstract FoodPortionType Type { get; }

        public abstract string GetId();
    }
}
