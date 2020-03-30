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
    public class ConsumedProductsOfTheDay : IConsumedProductsOfTheDay
    {
        private readonly AppDbContext _context;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public ConsumedProductsOfTheDay(AppDbContext context, IProductRepository productRepository, IMapper mapper)
        {
            _context = context;
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<List<ConsumedProductDto>> GetConsumedProductsOfTheDay(string userId, DateTime day)
        {
            if (day.Date != day)
                throw new ArgumentException("A date without a time must be given.", nameof(day));

            var consumedProducts = await _context.Set<ConsumedProduct>().Where(x => x.UserId == userId && x.Date == day).ToListAsync();
            if (!consumedProducts.Any())
                return new List<ConsumedProductDto>();

            var uniqueProductIds = consumedProducts.Select(x => x.ProductId).Distinct().ToList();
            var products = await _productRepository.BulkFindProductsByIds(uniqueProductIds);

            var consumedProductDtos = consumedProducts.Select(_mapper.Map<ConsumedProductDto>).ToList();
            foreach (var dto in consumedProductDtos)
            {
                dto.Label = products.First(x => x.Id == dto.ProductId).Label;
            }

            return consumedProductDtos;
        }
    }
}
