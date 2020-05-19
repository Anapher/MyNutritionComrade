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
    public interface IFrequentlyUsedProducts : IDataSelector
    {
        Task<Dictionary<ConsumptionTime, FoodPortionDto[]>> GetFrequentlyUsed(string userId);
    }

    public class FrequentlyUsedProducts : IFrequentlyUsedProducts
    {
        private readonly IFoodPortionDtoSelector _selector;
        private readonly IAsyncDocumentSession _session;

        public FrequentlyUsedProducts(IAsyncDocumentSession session, IFoodPortionDtoSelector selector)
        {
            _session = session;
            _selector = selector;
        }

        public async Task<Dictionary<ConsumptionTime, FoodPortionDto[]>> GetFrequentlyUsed(string userId)
        {
            var startingDate = DateTime.UtcNow.Date.AddMonths(-3);
            startingDate = new DateTime(startingDate.Year, startingDate.Month, 1);

            var commonConsumptions = await _session.Query<ConsumedFoods_ByMonth.Result, ConsumedFoods_ByMonth>()
                .Where(x => x.UserId == userId && x.Date >= startingDate).ToListAsync();

            var requestedInfo = commonConsumptions.Select(x => x.RecentId).ToList();

            var recentlyConsumed = (await _session.LoadAsync<Consumed>(requestedInfo)).Values;

            var dtos = await _selector.SelectViewModels(recentlyConsumed.Select(x => x.FoodPortion).ToList());
            return recentlyConsumed.GroupBy(x => x.Time).ToDictionary(x => x.Key, x => x.Select(y => dtos[y.FoodPortion]).ToArray());
        }
    }
}
