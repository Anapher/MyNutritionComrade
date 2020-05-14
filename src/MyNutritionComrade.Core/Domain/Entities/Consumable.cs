using System;
using System.Collections.Generic;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public abstract class Consumed
    {
        protected Consumed(string userId, DateTime date, ConsumptionTime time, NutritionalInfo nutritionalInfo)
        {
            if (date.Date != date)
                throw new ArgumentException("The date must not have a time associated.", nameof(date));

            UserId = userId;
            Date = date;
            Time = time;
            NutritionalInfo = nutritionalInfo;
        }

        public string UserId { get; private set; }

        public DateTime Date { get; private set; }
        public ConsumptionTime Time { get; private set; }

        public NutritionalInfo NutritionalInfo { get; set; }

        public abstract string Id { get; }

        protected string CreateId(string lastPart) => $"{UserId}/{Date:yyyy-MM-dd}/{Time}/{lastPart}";
    }

    public enum ConsumptionTime
    {
        Breakfast,
        Lunch,
        Dinner,
        Snack
    }

    public class ConsumedMeal : Consumed
    {
        public ConsumedMeal(string userId, DateTime date, ConsumptionTime time, NutritionalInfo nutritionalInfo, string mealId, double portion, string mealName)
            : base(userId, date, time, nutritionalInfo)
        {
            MealId = mealId;
            Portion = portion;
            MealName = mealName;
        }

        public string MealId { get; }
        public double Portion { get; }
        public string MealName { get; }

        public static ConsumedMeal FromMeal(Meal meal, double portion, string userId, DateTime date, ConsumptionTime time)
        {
            return new ConsumedMeal(userId, date, time, meal.NutritionalInfo.ChangeVolume(meal.NutritionalInfo.Volume * portion), meal.Id, portion, meal.Name);
        }

        public override string Id => CreateId(MealId);
    }

    public class ConsumedSuggestion : Consumed
    {
        public ConsumedSuggestion(string userId, DateTime date, ConsumptionTime time, NutritionalInfo nutritionalInfo, string suggestionId, List<ProductRef> products) : base(userId, date, time, nutritionalInfo)
        {
            SuggestionId = suggestionId;
            Products = products;
        }

        public string SuggestionId { get; set; }
        public List<ProductRef> Products { get; set; }

        public override string Id => CreateId(SuggestionId);
    }

    public class ProductRef
    {
        public ProductRef(string productId, NutritionalInfo nutritionalInfo)
        {
            ProductId = productId;
            NutritionalInfo = nutritionalInfo;
        }

        public string ProductId { get; set; }
        public NutritionalInfo NutritionalInfo { get; set; }
    }
}
