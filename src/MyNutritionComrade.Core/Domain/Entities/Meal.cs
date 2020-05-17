using System;
using System.Collections.Generic;
using System.Linq;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class Meal
    {
        private readonly List<FoodPortion> _items = new List<FoodPortion>();

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
        public IReadOnlyList<FoodPortion> Items => _items.AsReadOnly(); // this can contain any food portion

        public void Add(FoodPortion foodPortion)
        {
            if (_items.Any(x => x.GetId() == foodPortion.GetId()))
                throw new ArgumentException("The food already exists in this meal. Please replace it.");

            _items.Add(foodPortion);
            NutritionalInfo = _items.Select(x => x.NutritionalInfo).SumNutrition();
        }

        public void Remove(string id)
        {
            _items.Remove(_items.First(x => x.GetId() == id));
            NutritionalInfo = _items.Select(x => x.NutritionalInfo).SumNutrition();
        }
    }
}
