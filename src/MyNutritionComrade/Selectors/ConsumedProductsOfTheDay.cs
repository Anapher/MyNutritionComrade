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
    public interface IConsumedProductsOfTheDay : IDataSelector
    {
        Task<List<ConsumedProductDto>> GetConsumedProductsOfTheDay(string userId, DateTime day);
    }

    public class ConsumedProductsOfTheDay : IConsumedProductsOfTheDay
    {
        private readonly IAsyncDocumentSession _session;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public ConsumedProductsOfTheDay(IAsyncDocumentSession session, IProductRepository productRepository, IMapper mapper)
        {
            _session = session;
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<List<ConsumedProductDto>> GetConsumedProductsOfTheDay(string userId, DateTime day)
        {
            if (day.Date != day)
                throw new ArgumentException("A date without a time must be given.", nameof(day));

            var consumedProducts = await _session.Query<ConsumedProduct, ConsumedProduct_ByDate>().Where(x => x.UserId == userId && x.Date == day)
                .ToListAsync();

            if (!consumedProducts.Any())
                return new List<ConsumedProductDto>();

            var uniqueProductIds = consumedProducts.Select(x => x.ProductId).Distinct().ToList();
            var products = await _productRepository.FindByIds(uniqueProductIds);

            var consumedProductDtos = consumedProducts.Select(_mapper.Map<ConsumedProductDto>).ToList();
            foreach (var dto in consumedProductDtos)
            {
                dto.Label = products.First(x => x.Id == dto.ProductId).Label;
            }

            return consumedProductDtos;
        }
    }
}
