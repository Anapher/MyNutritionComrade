using System;
using MyNutritionComrade.Core.Shared;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class MealProduct : BaseEntity
    {
        private double _amount;

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

        public double Amount
        {
            get => _amount;
            set
            {
                if (value <= 0)
                    throw new ArgumentException("The amount must be greater than zero.");

                _amount = value;
            }
        }

        public ProductServing ProductServing { get; private set; }
    }
}
