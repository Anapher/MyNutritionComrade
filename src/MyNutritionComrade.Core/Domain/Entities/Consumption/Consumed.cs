using System;

namespace MyNutritionComrade.Core.Domain.Entities.Consumption
{
    public class Consumed
    {
        public Consumed(string userId, DateTime date, ConsumptionTime time, FoodPortion foodPortion)
        {
            if (date.Date != date)
                throw new ArgumentException("The date must not have a time associated.", nameof(date));

            UserId = userId;
            Date = date;
            Time = time;
            FoodPortion = foodPortion;
            FoodPortionId = foodPortion.GetId();
        }

        public string UserId { get; private set; }

        public DateTime Date { get; private set; }
        public ConsumptionTime Time { get; private set; }

        public FoodPortion FoodPortion { get; private set; }
        public string FoodPortionId { get; private set; }
    }
}