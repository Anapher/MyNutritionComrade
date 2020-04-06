using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Infrastructure.Data.Indexes;
using MyNutritionComrade.Models.Response;
using Raven.Client.Documents;
using Raven.Client.Documents.Session;

namespace MyNutritionComrade.Selectors
{
    public interface IFrequentlyUsedProducts : IDataSelector
    {
        Task<Dictionary<ConsumptionTime, FrequentlyUsedProductDto[]>> GetFrequentlyUsedProducts(string userId);
    }

    public class FrequentlyUsedProducts : IFrequentlyUsedProducts
    {
        private readonly IAsyncDocumentSession _session;
        private readonly IMapper _mapper;

        public FrequentlyUsedProducts(IAsyncDocumentSession session, IMapper mapper)
        {
            _session = session;
            _mapper = mapper;
        }

        public async Task<Dictionary<ConsumptionTime, FrequentlyUsedProductDto[]>> GetFrequentlyUsedProducts(string userId)
        {
            var startingDate = DateTime.UtcNow.Date.AddMonths(-3);
            startingDate = new DateTime(startingDate.Year, startingDate.Month, 1);

            // get frequently used product ids of every consumption time
            var result = new Dictionary<ConsumptionTime, FrequentlyUsedProductDto[]>();

            var consumedProducts = await _session.Query<ConsumedProduct_ByMonth.Result, ConsumedProduct_ByMonth>()
                .Where(x => x.UserId == userId && x.Date >= startingDate).ToListAsync();

            var uniqueProductIds = consumedProducts.Select(x => x.ProductId).Distinct().ToList();
            var products = await _session.LoadAsync<Product>(uniqueProductIds);

            foreach (var productStatistics in consumedProducts.GroupBy(x => x.Time))
            {
                var list = new List<FrequentlyUsedProductDto>();
                foreach (var product in productStatistics.OrderByDescending(x => x.Count))
                {
                    var p = products[product.ProductId];
                    var frequentProduct = _mapper.Map<FrequentlyUsedProductDto>(p);
                    list.Add(frequentProduct);
                }

                result.Add(productStatistics.Key, list.ToArray());
            }

            return result;
        }
    }
}
