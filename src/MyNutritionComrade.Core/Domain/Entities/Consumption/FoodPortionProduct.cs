using System;

namespace MyNutritionComrade.Core.Domain.Entities.Consumption
{
    public class FoodPortionProduct : FoodPortionItem
    {
        private double _amount;

        public FoodPortionProduct(string productId, NutritionalInfo nutritionalInfo, ServingType servingType, double amount) : base(nutritionalInfo)
        {
            ProductId = productId;
            ServingType = servingType;
            NutritionalInfo = nutritionalInfo;
            Amount = amount;
        }

        public string ProductId { get; private set; }

        public override FoodPortionType Type { get; } = FoodPortionType.Product;
        public override string GetId() => ProductId;

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

        public ServingType ServingType { get; private set; }
    }
}
