using System.Collections.Generic;
using System.Linq;
using MyNutritionComrade.Core.Shared;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class Meal : BaseEntity
    {
        private readonly List<MealProduct> _products = new List<MealProduct>();

        public Meal(int userId, string name)
        {
            Name = name;
            UserId = userId;
        }

        private Meal()
        {
        }

        public int UserId { get; private set; }
        public string Name { get; set; } = string.Empty;
        public NutritionInformation NutritionInformation { get; private set; } = NutritionInformation.Empty;

        public IReadOnlyList<MealProduct> Products => _products.AsReadOnly();

        //    public void AddProduct(MealProduct product)
        //    {
        //        _products.Add(product);
        //        NutritionInformation = _products.Select(x => x.ProductServing.Product.NutritionInformation.ChangeMass(x.ProductServing.Weight * x.Amount)).SumNutrition();
        //    }

        //    public void RemoveProduct(int mealProductId)
        //    {
        //        _products.Remove(_products.First(x => x.Id == mealProductId));
        //        NutritionInformation = _products.Select(x => x.ProductServing.Product.NutritionInformation.ChangeMass(x.ProductServing.Weight * x.Amount)).SumNutrition();
        //    }
        //}
    }
}
