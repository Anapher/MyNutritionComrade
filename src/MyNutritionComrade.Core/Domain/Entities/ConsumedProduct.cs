using System;
using System.Collections.Generic;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ConsumedProduct
    {
        public ConsumedProduct(string userId, DateTime day, ConsumptionTime time, string productId, NutritionInformation nutritionInformation, ISet<string> tags)
        {
            if (day.Date != day)
                throw new ArgumentException("The date must not have a time associated.", nameof(day));

            UserId = userId;
            Day = day;
            Time = time;
            ProductId = productId;
            NutritionInformation = nutritionInformation;
            Tags = tags;
        }

        public string UserId { get; private set; }

        public DateTime Day { get; private set; }
        public ConsumptionTime Time { get; private set; }

        public string ProductId { get; private set; }

        public NutritionInformation NutritionInformation { get; set; }
        public ISet<string> Tags { get; private set; }
    }

    public enum ConsumptionTime
    {
        Breakfast,
        Lunch,
        Dinner,
        Snack
    }
}
