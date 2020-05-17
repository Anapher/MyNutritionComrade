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

            var requestedInfo = commonConsumptions.Select(x => $"{x.Time}/{x.FoodPortionId}").ToList();

            var foodPortions = await _session.Query<Consumed, Consumed_ByDate>().Where(x => x.UserId == userId).OrderByDescending(x => x.Date)
                .GroupBy(x => $"{x.Time}/{x.FoodPortionId}").Where(x => x.Key.In(requestedInfo)).Select(x => x.First()).ToListAsync();

            var result = new Dictionary<ConsumptionTime, FoodPortion[]>();
            foreach (var commonConsumption in commonConsumptions.GroupBy(x => x.Time))
                result.Add(commonConsumption.Key,
                    commonConsumption.Select(x => foodPortions.First(y => y.Time == commonConsumption.Key && y.FoodPortionId == x.FoodPortionId).FoodPortion)
                        .ToArray());

            var dtos = await _selector.SelectViewModels(result.SelectMany(x => x.Value).ToList());
            return result.ToDictionary(x => x.Key, x => x.Value.Select(y => dtos[y]).ToArray());
        }
    }
}
