using System;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto;
using MyNutritionComrade.Core.Errors;
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

        public async Task<Error?> Apply(ProductContribution productContribution)
        {
            // this method should not suffer from race conditions
            var product = await _collection.Products.Find(Builders<Product>.Filter.Eq(x => x.Id, productContribution.ProductId)).FirstOrDefaultAsync();
            var newVersion = product.Version + 1; // increment version

            UpdateResult result;

            var patch = BsonDocument.Parse(productContribution.Patch.ToString());

            try
            {
                result = await _collection.Products.UpdateOneAsync(
                    Builders<Product>.Filter.And(Builders<Product>.Filter.Eq(x => x.Id, productContribution.ProductId),
                        Builders<Product>.Filter.Eq(x => x.Version, product.Version)),
                    Builders<Product>.Update.Combine(patch, Builders<Product>.Update.Set(x => x.Version, newVersion)));
            }
            catch (MongoWriteException e)
            {
                if (e.WriteError.Category == ServerErrorCategory.DuplicateKey)
                    return new DomainError(ErrorType.StateError, "Duplicate key inserted. Please make sure that a product with the same code does not exist.",
                        ErrorCode.Product_DuplicateKeyInserted);

                throw;
            }

            if (result.ModifiedCount != 1)
                return new RaceConditionError("Product could not be modified. Possible race condition.", ErrorCode.Product_VersionMismatch);

            productContribution.Apply(newVersion);

            await _collection.ProductContributions.ReplaceOneAsync(Builders<ProductContribution>.Filter.Eq(x => x.Id, productContribution.Id),
                productContribution);

            await UpdateProductContributions(product.Id);
            return null;
        }

        private async Task UpdateProductContributions(string productId)
        {
            var product = await _collection.Products.Find(Builders<Product>.Filter.Eq(x => x.Id, productId)).FirstOrDefaultAsync();
            if (product == null)
                throw new InvalidOperationException("Cannot add product contribution for product that does not exist");

            // add all pending product contributions
            var pendingProductContributions = await _collection.ProductContributions.Find(Builders<ProductContribution>.Filter.And(
                Builders<ProductContribution>.Filter.Eq(x => x.ProductId, productId),
                Builders<ProductContribution>.Filter.Or(Builders<ProductContribution>.Filter.Eq(x => x.Status, ProductContributionStatus.Pending),
                    Builders<ProductContribution>.Filter.Eq(x => x.AppliedVersion, product.Version)))).ToListAsync();

            var contributions = pendingProductContributions.OrderBy(x => x.AppliedVersion == product.Version).ThenByDescending(x => x.CreatedOn).ToList();

            // update product
            await _collection.Products.UpdateOneAsync(Builders<Product>.Filter.Eq(x => x.Id, product.Id),
                Builders<Product>.Update.Set(x => x.Contributions, contributions));
        }
    }
}
