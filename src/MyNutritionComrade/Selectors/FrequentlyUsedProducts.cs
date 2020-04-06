using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
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
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        private const int ProductsTimeFrame = 60; // Consider products of the last 60 active days
        private const int QueriedProductsPerConsumptionTime = 20;

        public FrequentlyUsedProducts(IAsyncDocumentSession session, IProductRepository productRepository, IMapper mapper)
        {
            _session = session;
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<Dictionary<ConsumptionTime, FrequentlyUsedProductDto[]>> GetFrequentlyUsedProducts(string userId)
        {
            // select start date, so we can adjust to changing habits
            var timeFrame = await _session.Query<ConsumedProduct, ConsumedProduct_ByDate>().Where(x => x.UserId == userId).OrderByDescending(x => x.Date)
                .Select(x => x.Date).Distinct().Skip(ProductsTimeFrame).FirstOrDefaultAsync();

            // get frequently used product ids of every consumption time
            var result = new Dictionary<ConsumptionTime, List<(string, double)>>();
            foreach (var consumptionTime in Enum.GetValues(typeof(ConsumptionTime)).Cast<ConsumptionTime>())
            {
                var productIds = await _session.Query<ConsumedProduct, ConsumedProduct_ByDate>().Where(x => x.UserId == userId && x.Time == consumptionTime && x.Date >= timeFrame)
                    .GroupBy(x => x.ProductId).OrderByDescending(x => x.Count()).Take(QueriedProductsPerConsumptionTime).Select(x => x.Key).ToListAsync();

                result.Add(consumptionTime, productIds.Select(x => (x, 0.0)).ToList());
            }

            // map to actual product objects
            var uniqueProductIds = result.SelectMany(x => x.Value.Select(y => y.Item1)).Distinct().ToList();
            var products = await _productRepository.FindByIds(uniqueProductIds);

            return result.ToDictionary(x => x.Key, x => x.Value.Select(y =>
            {
                var (id, volume) = y;
                var p = products.First(z => z.Id == id);
                var frequentProduct = _mapper.Map<FrequentlyUsedProductDto>(p);
                frequentProduct.RecentlyConsumedVolume = volume;
                return frequentProduct;
            }).ToArray());
        }
    }
}
