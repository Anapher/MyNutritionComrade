using System;
using System.Collections.Generic;
using System.Linq;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class Meal
    {
        private readonly List<MealProduct> _products = new List<MealProduct>();

        public Meal(string name, string userId)
        {
            Name = name;
            UserId = userId;
        }

        public string Id { get; private set; } = string.Empty;
        public string UserId { get; private set; }
        public DateTimeOffset CreatedOn { get; private set; } = DateTimeOffset.UtcNow;

        public string Name { get; set; }
        public NutritionalInfo NutritionalInfo { get; private set; } = NutritionalInfo.Empty;
        public IReadOnlyList<MealProduct> Products => _products.AsReadOnly();

        public void AddProduct(MealProduct product)
        {
            if (_products.Any(x => x.ProductId == product.ProductId))
                throw new ArgumentException("The product already exists in this meal. Please replace it.");

            _products.Add(product);
            NutritionalInfo = _products.Select(x => x.NutritionalInfo).SumNutrition();
        }

        public void RemoveProduct(string productId)
        {
            _products.Remove(_products.First(x => x.ProductId == productId));
            NutritionalInfo = _products.Select(x => x.NutritionalInfo).SumNutrition();
        }
    }
}
