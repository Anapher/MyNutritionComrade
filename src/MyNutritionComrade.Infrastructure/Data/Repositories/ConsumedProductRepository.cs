using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class ConsumedProductRepository : IConsumedProductRepository
    {
        private readonly AppDbContext _context;

        public ConsumedProductRepository(AppDbContext context)
        {
            _context = context;
        }

#pragma warning disable CS8619 // Nullability of reference types in value doesn't match target type.

        public ValueTask<ConsumedProduct?> FindExistingConsumedProduct(string userId, DateTime date, ConsumptionTime time, string productId) =>
            _context.Set<ConsumedProduct>().FindAsync(userId, date, time, productId);

#pragma warning restore CS8619 // Nullability of reference types in value doesn't match target type.

        public Task Add(ConsumedProduct consumedProduct)
        {
            _context.Add(consumedProduct);
            return _context.SaveChangesAsync();
        }

        public Task Update(ConsumedProduct consumedProduct)
        {
            _context.Entry(consumedProduct).State = EntityState.Modified;
            return _context.SaveChangesAsync();
        }

        public Task Delete(ConsumedProduct consumedProduct)
        {
            _context.Set<ConsumedProduct>().Remove(consumedProduct);
            return _context.SaveChangesAsync();
        }
    }
}
