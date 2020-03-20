﻿using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly IProductsCollection _productsCollection;

        public ProductRepository(IProductsCollection productsCollection)
        {
            _productsCollection = productsCollection;
        }

        public async Task<Product?> FindById(string productId)
        {
            return await _productsCollection.Products.Find(Builders<Product>.Filter.Eq(x => x.Id, productId)).FirstOrDefaultAsync();
        }

        public Task Add(Product product)
        {
            return _productsCollection.Products.InsertOneAsync(product);
        }

        public Task Update(Product product)
        {
            return _productsCollection.Products.ReplaceOneAsync(Builders<Product>.Filter.Eq(x => x.Id, product.Id), product);
        }
    }
}
