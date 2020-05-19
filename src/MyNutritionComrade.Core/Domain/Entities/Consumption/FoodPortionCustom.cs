using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.Domain.Entities.Consumption
{
    public class FoodPortionCustom : FoodPortionItem
    {
        public FoodPortionCustom(NutritionalInfo nutritionalInfo, string? label) : base(nutritionalInfo)
        {
            Label = label;
        }

        public string? Label { get; private set; }
        public override FoodPortionType Type { get; } = FoodPortionType.Custom;
        public override string GetId() => NutritionalInfo.Hash();
    }
}
