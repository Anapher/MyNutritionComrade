namespace MyNutritionComrade.Core.Domain.Entities.Consumption
{
    public abstract class FoodPortion
    {
        protected FoodPortion(NutritionalInfo nutritionalInfo)
        {
            NutritionalInfo = nutritionalInfo;
        }

        public NutritionalInfo NutritionalInfo { get; set; }
        public abstract FoodPortionType Type { get; }

        public abstract string GetId();
    }
}
