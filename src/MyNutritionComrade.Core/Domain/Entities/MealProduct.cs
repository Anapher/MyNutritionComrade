using MyNutritionComrade.Core.Utilities;
using System;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class MealProduct
    {
        private double _amount;

        public MealProduct(string productId, NutritionalInfo nutritionalInfo, ServingType servingType, double amount)
        {
            ProductId = productId;
            NutritionalInfo = nutritionalInfo;
            ServingType = servingType;
            _amount = amount;
        }

        public string ProductId { get; private set; }
        public NutritionalInfo NutritionalInfo { get; private set; }

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

        public static MealProduct Create(Product product, double amount, ServingType servingType)
        {
            if (!product.Servings.TryGetValue(servingType, out var servingSize))
                throw new InvalidOperationException($"The product with id {product.Id} does not have a serving of type {servingType}.");

            var nutritionalInfo = product.NutritionalInfo.ChangeVolume(amount * servingSize);
            return new MealProduct(product.Id, nutritionalInfo, servingType, amount);
        }
    }
}
