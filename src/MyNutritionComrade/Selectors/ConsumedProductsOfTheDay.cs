using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Infrastructure.Data.Indexes;
using MyNutritionComrade.Models.Response;
using Raven.Client.Documents;
using Raven.Client.Documents.Linq;
using Raven.Client.Documents.Session;

namespace MyNutritionComrade.Selectors
{
    public interface IConsumedOfTheDay : IDataSelector
    {
        Task<Dictionary<DateTime, List<ConsumedDto>>> GetConsumedOfTheDay(string userId, DateTime fromDay, int daysBackInTime = 0);
    }

    public class ConsumedOfTheDay : IConsumedOfTheDay
    {
        private const int MaxRequestedDays = 9;

        private readonly IAsyncDocumentSession _session;
        private readonly IConsumedDtoSelector _selector;

        public ConsumedOfTheDay(IAsyncDocumentSession session, IConsumedDtoSelector selector)
        {
            _session = session;
            _selector = selector;
        }

        public async Task<Dictionary<DateTime, List<ConsumedDto>>> GetConsumedOfTheDay(string userId, DateTime fromDay, int daysBackInTime = 0)
        {
            if (fromDay.Date != fromDay)
                throw new ArgumentException("A date without a time must be given.", nameof(fromDay));

            if (daysBackInTime < 0)
                throw new ArgumentException("Must at least request one day.", nameof(fromDay));

            if (daysBackInTime > MaxRequestedDays)
                throw new ArgumentException($"The maximum amount of requested days is {MaxRequestedDays}.", nameof(daysBackInTime));

            var days = Enumerable.Range(0, daysBackInTime).Select(x => fromDay.AddDays(-x)).ToList();

            var consumedProducts = await _session.Query<Consumed, Consumed_ByDate>().Where(x => x.UserId == userId && x.Date.In(days)).ToListAsync();
            var result = await _selector.SelectConsumedDtos(consumedProducts);

            return days.ToDictionary(date => date, date => result.Where(x => x.Date == date).ToList());
        }
    }
}
