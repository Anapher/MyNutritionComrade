using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Data;
using MyNutritionComrade.Models.Response;

namespace MyNutritionComrade.Selectors
{
    public class FrequentlyUsedProducts : IFrequentlyUsedProducts
    {
        private readonly AppDbContext _context;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        private const int ProductsTimeFrame = 60; // Consider products of the last 60 active days
        private const int QueriedProductsPerConsumptionTime = 20;

        public FrequentlyUsedProducts(AppDbContext context, IProductRepository productRepository, IMapper mapper)
        {
            _context = context;
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<Dictionary<ConsumptionTime, ProductDto[]>> GetFrequentlyUsedProducts(string userId)
        {
            // select start date, so we can adjust to changing habits
            var timeFrame = await _context.Set<ConsumedProduct>().Where(x => x.UserId == userId).Select(x => (DateTime?) x.Day).Distinct()
                .OrderByDescending(x => x).Skip(ProductsTimeFrame).FirstOrDefaultAsync() ?? DateTime.MinValue;

            // get frequently used product ids of every consumption time
            var result = new Dictionary<ConsumptionTime, List<string>>();
            foreach (var consumptionTime in Enum.GetValues(typeof(ConsumptionTime)).Cast<ConsumptionTime>())
            {
                var productIds = await _context.Set<ConsumedProduct>().Where(x => x.UserId == userId && x.Time == consumptionTime && x.Day >= timeFrame)
                    .GroupBy(x => x.ProductId).OrderByDescending(x => x.Count()).Take(QueriedProductsPerConsumptionTime).Select(x => x.Key).ToListAsync();
                result.Add(consumptionTime, productIds);
            }

            // map to actual product objects
            var uniqueProductIds = result.SelectMany(x => x.Value).Distinct().ToList();
            var products = (await _productRepository.BulkFindProductsByIds(uniqueProductIds)).Select(_mapper.Map<ProductDto>);

            return result.ToDictionary(x => x.Key, x => x.Value.Select(y => products.First(z => z.Id == y)).ToArray());
        }
    }
}
