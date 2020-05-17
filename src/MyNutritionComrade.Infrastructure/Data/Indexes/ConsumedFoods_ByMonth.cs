#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

using System;
using System.Linq;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using Raven.Client.Documents.Indexes;

namespace MyNutritionComrade.Infrastructure.Data.Indexes
{
    public class ConsumedFoods_ByMonth : AbstractIndexCreationTask<Consumed, ConsumedFoods_ByMonth.Result>
    {
        public ConsumedFoods_ByMonth()
        {
            Map = allConsumed => allConsumed.Select(consumed => new
            {
                consumed.UserId,
                Id = consumed.FoodPortionId,
                Date = new DateTime(consumed.Date.Year, consumed.Date.Month, 1),
                consumed.Time,
                Count = 1
            });

            Reduce = results => results.GroupBy(x => new
            {
                x.UserId,
                Id = x.FoodPortionId,
                x.Date,
                x.Time
            }).Select(g => new
            {
                g.Key.UserId,
                g.Key.Id,
                g.Key.Date,
                g.Key.Time,
                Count = g.Sum(x => x.Count)
            });
        }

        public class Result
        {
            public string UserId { get; set; }
            public string FoodPortionId { get; set; }

            public DateTime Date { get; set; }

            public ConsumptionTime Time { get; set; }

            public int Count { get; set; }
        }
    }
}
