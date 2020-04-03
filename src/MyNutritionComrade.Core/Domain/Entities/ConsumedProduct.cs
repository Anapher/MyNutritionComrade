using System;
using System.Collections.Immutable;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ConsumedProduct
    {
        public ConsumedProduct(string userId, DateTime date, ConsumptionTime time, string productId, NutritionalInfo nutritionalInfo, IImmutableSet<string> tags)
        {
            if (date.Date != date)
                throw new ArgumentException("The date must not have a time associated.", nameof(date));

            UserId = userId;
            Date = date;
            Time = time;
            ProductId = productId;
            NutritionalInfo = nutritionalInfo;
            Tags = tags;
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private ConsumedProduct()
        {
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        public string UserId { get; private set; }

        public DateTime Date { get; private set; }
        public ConsumptionTime Time { get; private set; }

        public string ProductId { get; private set; }

        public NutritionalInfo NutritionalInfo { get; set; }
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
