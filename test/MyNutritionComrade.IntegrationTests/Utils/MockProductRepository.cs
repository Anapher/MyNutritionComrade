using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;

namespace MyNutritionComrade.IntegrationTests.Utils
{
    public class MockProductRepository : IProductRepository
    {
        private readonly ConcurrentDictionary<string, Product> _products = new ConcurrentDictionary<string, Product>();

        public IEnumerable<Product> Products => _products.Values;

        public Task<Product> FindById(string productId)
        {
            if (_products.TryGetValue(productId, out var product))
                return Task.FromResult(product);

            return Task.FromResult<Product>(null);
        }

        public void EnsureProductExists(Product product)
        {
            _products.TryAdd(product.Id, product);
        }

        public Task Add(Product product)
        {
            if (_products.TryAdd(product.Id, product))
                return Task.CompletedTask;

            throw new InvalidOperationException("Product already exists");
        }

        public Task Update(Product product)
        {
            _products[product.Id] = product;
            return Task.CompletedTask;
        }

        public Task Delete(string productId)
        {
            _products.TryRemove(productId, out _);
            return Task.CompletedTask;
        }

        public Task<List<Product>> BulkFindProductsByIds(IEnumerable<string> ids)
        {
            var result = new List<Product>();
            foreach (var id in ids)
                if (_products.TryGetValue(id, out var p))
                    result.Add(p);

            return Task.FromResult(result);
        }
    }
}
