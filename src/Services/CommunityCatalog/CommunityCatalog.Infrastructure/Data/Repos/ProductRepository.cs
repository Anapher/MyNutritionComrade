using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Gateways.Repos;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using MyNutritionComrade.Models;

namespace CommunityCatalog.Infrastructure.Data.Repos
{
    public class ProductRepository : MongoRepo<VersionedProduct>, IProductRepository, IMongoIndexBuilder
    {
        static ProductRepository()
        {
            BsonClassMap.RegisterClassMap<Product>(config =>
            {
                config.AutoMap();
                config.MapIdMember(x => x.Id);
            });
        }

        public ProductRepository(IOptions<MongoDbOptions> options) : base(options)
        {
        }

        public async ValueTask Add(VersionedProduct product)
        {
            await Collection.InsertOneAsync(product);
        }

        public async ValueTask<VersionedProduct?> FindById(string productId)
        {
            return await Collection.Find(x => x.Id == productId).FirstOrDefaultAsync();
        }

        public async ValueTask<VersionedProduct?> FindByCode(string code)
        {
            return await Collection.Find(x => x.Code == code).FirstOrDefaultAsync();
        }

        public async ValueTask<DateTimeOffset?> GetLatestProductChange()
        {
            try
            {
                return await Collection.AsQueryable().MinAsync(x => x.ModifiedOn);
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
            return await Collection.AsQueryable().ToListAsync();
        }

        public async Task CreateIndexes()
        {
            await Collection.Indexes.CreateOneAsync(new CreateIndexModel<VersionedProduct>(
                Builders<VersionedProduct>.IndexKeys.Ascending(x => x.Code),
                new CreateIndexOptions<VersionedProduct>
                {
                    Unique = true,
                    PartialFilterExpression = Builders<VersionedProduct>.Filter.Type(x => x.Code, BsonType.String),
                }));
        }
    }
}
