using System.Collections.Generic;

namespace MyNutritionComrade.Core.Domain.Entities.Consumption
{
    public class FoodPortionMeal : FoodPortion
    {
        public FoodPortionMeal(NutritionalInfo nutritionalInfo, string mealId, double portion, string mealName, List<FoodPortionItem> items) :
            base(nutritionalInfo)
        {
            MealId = mealId;
            Portion = portion;
            MealName = mealName;
            Items = items;
        }

        public string MealId { get; }
        public double Portion { get; }
        public string MealName { get; }

        /// <summary>
        ///     A snapshot of the flattened products used in this meal. The items of this list must only be
        ///     <see cref="FoodPortionProduct" /> or <see cref="FoodPortionCustom" />
        /// </summary>
        public List<FoodPortionItem> Items { get; private set; }

        public override string GetId() => MealId;
    }
}
