using System;
using System.Collections.Immutable;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ConsumedProduct
    {
        public ConsumedProduct(string userId, DateTime day, ConsumptionTime time, string productId, NutritionInformation nutritionInformation, IImmutableSet<string> tags)
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

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private ConsumedProduct()
        {
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        public string UserId { get; private set; }

        public DateTime Day { get; private set; }
        public ConsumptionTime Time { get; private set; }

        public string ProductId { get; private set; }

        public NutritionInformation NutritionInformation { get; set; }
        public IImmutableSet<string> Tags { get; private set; }
    }

    public enum ConsumptionTime
    {
        Breakfast,
        Lunch,
        Dinner,
        Snack
    }
}
