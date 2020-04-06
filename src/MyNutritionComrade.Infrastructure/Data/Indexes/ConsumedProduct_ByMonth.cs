#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

using System;
using System.Linq;
using MyNutritionComrade.Core.Domain.Entities;
using Raven.Client.Documents.Indexes;

namespace MyNutritionComrade.Infrastructure.Data.Indexes
{
    public class ConsumedProduct_ByMonth : AbstractIndexCreationTask<ConsumedProduct, ConsumedProduct_ByMonth.Result>
    {
        public ConsumedProduct_ByMonth()
        {
            Map = products => from product in products
            select new
            {
                product.UserId,
                product.ProductId,

                Date = new DateTime(product.Date.Year, product.Date.Month, 1),
                product.Time,
                Count = 1
            };

            Reduce = results => results.GroupBy(x => new
            {
                x.UserId,
                x.ProductId,
                x.Date,
                x.Time
            }).Select(g => new
            {
                g.Key.UserId,
                g.Key.ProductId,
                g.Key.Date,
                g.Key.Time,
                Count = g.Sum(x => x.Count)
            });
        }

        public class Result
        {
            public string UserId { get; set; }
            public string ProductId { get; set; }

            public DateTime Date { get; set; }

            public ConsumptionTime Time { get; set; }

            public int Count { get; set; }
        }
    }
}
