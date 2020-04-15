using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Infrastructure.Data.Indexes;
using MyNutritionComrade.Models.Response;
using Raven.Client.Documents;
using Raven.Client.Documents.Linq;
using Raven.Client.Documents.Session;

namespace MyNutritionComrade.Selectors
{
    public interface IConsumedProductsOfTheDay : IDataSelector
    {
        Task<Dictionary<DateTime, List<ConsumedProductDto>>> GetConsumedProductsOfTheDay(string userId, DateTime fromDay, int daysBackInTime = 0);
    }

    public class ConsumedProductsOfTheDay : IConsumedProductsOfTheDay
    {
        private const int MaxRequestedDays = 9;

        private readonly IAsyncDocumentSession _session;
        private readonly IMapper _mapper;

        public ConsumedProductsOfTheDay(IAsyncDocumentSession session, IMapper mapper)
        {
            _session = session;
            _mapper = mapper;
        }

        public async Task<Dictionary<DateTime, List<ConsumedProductDto>>> GetConsumedProductsOfTheDay(string userId, DateTime fromDay, int daysBackInTime = 0)
        {
            if (fromDay.Date != fromDay)
                throw new ArgumentException("A date without a time must be given.", nameof(fromDay));

            if (daysBackInTime < 0)
                throw new ArgumentException("Must at least request one day.", nameof(fromDay));

            if (daysBackInTime > MaxRequestedDays)
                throw new ArgumentException($"The maximum amount of requested days is {MaxRequestedDays}.", nameof(daysBackInTime));

            var days = Enumerable.Range(0, daysBackInTime).Select(x => fromDay.AddDays(-x)).ToList();

            var consumedProducts = await _session.Query<ConsumedProduct, ConsumedProduct_ByDate>().Where(x => x.UserId == userId && x.Date.In(days))
                .ToListAsync();

            var uniqueProducts = consumedProducts.Select(x => x.ProductId).Distinct().ToList();
            var products = await _session.LoadAsync<Product>(uniqueProducts);

            var consumedProductDtos = consumedProducts.Select(_mapper.Map<ConsumedProductDto>).ToList();
            foreach (var dto in consumedProductDtos)
            {
                var product = products[dto.ProductId]; // should be synchronous
                dto.Label = product.Label;
            }

            return days.ToDictionary(date => date, date => consumedProductDtos.Where(x => x.Date == date).ToList());
        }
    }
}
