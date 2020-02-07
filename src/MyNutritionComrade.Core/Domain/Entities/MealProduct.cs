using MyNutritionComrade.Core.Shared;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class MealProduct : BaseEntity
    {
        public MealProduct(int mealId, ProductServing productServing, double amount)
        {
            MealId = mealId;
            ProductServing = productServing;
            Amount = amount;
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private MealProduct(double amount)
        {
            Amount = amount;
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        public int MealId { get; private set; }
        public int ProductServingId { get; private set; }

        public double Amount { get; private set; }

        public ProductServing ProductServing { get; private set; }
    }
}
