using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Gateways.Repos;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Concurrency;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using MyNutritionComrade.Models;

namespace CommunityCatalog.Infrastructure.Data.Repos
{
    public class ProductRepository : MongoRepo<ProductDocument>, IProductRepository, IMongoIndexBuilder
    {
        static ProductRepository()
        {
            BsonClassMap.RegisterClassMap<ProductDocument>(config =>
            {
                config.AutoMap();
                config.MapIdMember(x => x.ProductId);
            });
        }

        public ProductRepository(IOptions<MongoDbOptions> options) : base(options)
        {
        }

        public async ValueTask Add(ProductDocument product)
        {
            await Collection.InsertOneAsync(product);
        }

        public async ValueTask Update(ProductDocument product)
        {
            await Collection.Optimistic(x => x.ConcurrencyToken).UpdateAsync(product);
        }

        public async ValueTask<ProductDocument?> FindById(string productId)
        {
            return await Collection.Find(x => x.Product.Id == productId).FirstOrDefaultAsync();
        }

        public async ValueTask<ProductDocument?> FindByCode(string code)
        {
            return await Collection.Find(x => x.Product.Code == code).FirstOrDefaultAsync();
        }

        public async ValueTask<DateTimeOffset?> GetLatestProductChange()
        {
            try
            {
                return await Collection.AsQueryable().MaxAsync(x => x.Product.ModifiedOn);
            }
            catch (InvalidOperationException)
            {
                if (await Collection.AsQueryable().CountAsync() == 0)
                    return null;

                throw;
            }
        }

        public async ValueTask<IReadOnlyList<Product>> GetAll()
        {
            return await Collection.AsQueryable().Select(x => x.Product).ToListAsync();
        }

        public async Task CreateIndexes()
        {
            await Collection.Indexes.CreateOneAsync(new CreateIndexModel<ProductDocument>(
                Builders<ProductDocument>.IndexKeys.Ascending(x => x.Product.Code),
                new CreateIndexOptions<ProductDocument>
                {
                    Unique = true,
                    PartialFilterExpression =
                        Builders<ProductDocument>.Filter.Type(x => x.Product.Code, BsonType.String),
                }));
        }
    }
}
