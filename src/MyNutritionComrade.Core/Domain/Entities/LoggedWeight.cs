using System;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class LoggedWeight
    {
        public LoggedWeight(string userId, double value, DateTimeOffset timestamp)
        {
            UserId = userId;
            Value = value;
            Timestamp = timestamp;
        }

        public string UserId { get; private set; }
        public double Value { get; private set; }
        public DateTimeOffset Timestamp { get; private set; }
    }
}
