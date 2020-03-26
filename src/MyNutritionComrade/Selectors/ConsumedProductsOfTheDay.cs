using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Infrastructure.Data;
using MyNutritionComrade.Models.Response;

namespace MyNutritionComrade.Selectors
{
    public class ConsumedProductsOfTheDay : IConsumedProductsOfTheDay
    {
        private readonly AppDbContext _context;
        private readonly IProductsCollection _productsCollection;
        private readonly IMapper _mapper;

        public ConsumedProductsOfTheDay(AppDbContext context, IProductsCollection productsCollection, IMapper mapper)
        {
            _context = context;
            _productsCollection = productsCollection;
            _mapper = mapper;
        }

        public async Task<List<ConsumedProductDto>> GetConsumedProductsOfTheDay(string userId, DateTime day)
        {
            if (day.Date != day)
                throw new ArgumentException("A date without a time must be given.", nameof(day));

            var consumedProducts = await _context.Set<ConsumedProduct>().Where(x => x.UserId == userId && x.Day == day).ToListAsync();
            if (!consumedProducts.Any())
                return new List<ConsumedProductDto>();

            var uniqueProductIds = consumedProducts.Select(x => x.ProductId).Distinct().ToList();
            var products = await _productsCollection.Products.Find(Builders<Product>.Filter.In(x => x.Id, uniqueProductIds)).ToListAsync();

            var consumedProductDtos = consumedProducts.Select(_mapper.Map<ConsumedProductDto>).ToList();
            foreach (var dto in consumedProductDtos)
            {
                dto.Label = products.First(x => x.Id == dto.ProductId).Label;
            }

            return consumedProductDtos;
        }
    }
}
