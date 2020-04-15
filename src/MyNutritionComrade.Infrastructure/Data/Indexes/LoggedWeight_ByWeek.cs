using System;
using System.Linq;
using MyNutritionComrade.Core.Domain.Entities;
using Raven.Client.Documents.Indexes;

namespace MyNutritionComrade.Infrastructure.Data.Indexes
{
//    public class LoggedWeight_ByWeek : AbstractIndexCreationTask<LoggedWeight, LoggedWeight_ByWeek.LoggedWeightByWeek>
//    {
//        private static readonly DateTimeOffset StartDate = new DateTimeOffset(2020, 4, 12, 0, 0, 0, TimeSpan.Zero);

//        public LoggedWeight_ByWeek()
//        {
//            Map = weight => weight.Select(x => new {Week = (int) ((x.Timestamp - StartDate).TotalDays / 7), x.UserId, x.Value, AveragedFrom = 1});

//            Reduce = results => from result in results
//                group result by new {result.UserId, result.Week}
//                into g
//                let count = g.Sum(x => x.AveragedFrom)
//                let valueSum = g.Sum(x => x.Value)
//                select new {g.Key.Week, g.Key.UserId, Value = valueSum / count, AveragedFrom = count};
//        }

//#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
//        public class LoggedWeightByWeek
//        {
//            public int Week { get; set; }
//            public string UserId { get; set; }
//            public double Value { get; set; }
//            public int AveragedFrom { get; set; }
//        }
//    }
}
