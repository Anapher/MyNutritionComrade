namespace MyNutritionComrade.Core.Domain.Entities.Consumption
{
    public abstract class FoodPortionItem : FoodPortion
    {
        protected FoodPortionItem(NutritionalInfo nutritionalInfo) : base(nutritionalInfo)
        {
        }
    }
}