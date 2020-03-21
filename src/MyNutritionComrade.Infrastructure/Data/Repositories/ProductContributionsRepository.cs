using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class ProductContributionsRepository : IProductContributionsRepository
    {
        private readonly IProductsCollection _collection;

        public ProductContributionsRepository(IProductsCollection collection)
        {
            _collection = collection;
        }

        public async Task Add(ProductContribution productContribution)
        {
            // insert entry
            await _collection.ProductContributions.InsertOneAsync(productContribution);

            await UpdateProductContributions(productContribution.ProductId);
        }

        public async Task Apply(ProductContribution productContribution)
        {
            // this method should not suffer from race conditions
            var product = await _collection.Products.Find(Builders<Product>.Filter.Eq(x => x.Id, productContribution.ProductId)).FirstOrDefaultAsync();
            var newVersion = product.Version + 1; // increment version

            var result = await _collection.Products.UpdateOneAsync(
                Builders<Product>.Filter.And(Builders<Product>.Filter.Eq(x => x.Id, productContribution.ProductId),
                    Builders<Product>.Filter.Eq(x => x.Version, product.Version)),
                Builders<Product>.Update.Combine(productContribution.Patch, Builders<Product>.Update.Set(x => x.Version, newVersion)));

            if (result.ModifiedCount != 1)
                throw new InvalidOperationException("Product could not be modified. Possible race condition.");

            productContribution.Apply(newVersion);

            await _collection.ProductContributions.ReplaceOneAsync(Builders<ProductContribution>.Filter.Eq(x => x.Id, productContribution.Id),
                productContribution);

            await UpdateProductContributions(product.Id);
        }

        private async Task UpdateProductContributions(string productId)
        {
            var product = await _collection.Products.Find(Builders<Product>.Filter.Eq(x => x.Id, productId)).FirstOrDefaultAsync();
            if (product == null)
                throw new InvalidOperationException("Cannot add product contribution for product that does not exist");

            var newContributions = new List<ProductContribution>();

            // try to find the contribution that is currently applied and if found, add it to the list
            var applied = product.Contributions.FirstOrDefault(x => x.AppliedVersion == product.Version);
            if (applied != null) newContributions.Add(applied);

            // add all pending product contributions
            var pendingProductContributions = await _collection.ProductContributions.Find(Builders<ProductContribution>.Filter.And(
                Builders<ProductContribution>.Filter.Eq(x => x.ProductId, productId),
                Builders<ProductContribution>.Filter.Eq(x => x.Status, ProductContributionStatus.Pending))).ToListAsync();

            newContributions.AddRange(pendingProductContributions.OrderBy(x => x.CreatedOn));

            // update product
            await _collection.Products.UpdateOneAsync(Builders<Product>.Filter.Eq(x => x.Id, product.Id),
                Builders<Product>.Update.Set(x => x.Contributions, newContributions));
        }
    }
}
