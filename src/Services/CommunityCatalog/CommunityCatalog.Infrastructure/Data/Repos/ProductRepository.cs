using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Gateways.Repos;
using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
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

        public async Task CreateIndexes()
        {
            await Collection.Indexes.CreateOneAsync(new CreateIndexModel<VersionedProduct>(
                Builders<VersionedProduct>.IndexKeys.Ascending(x => x.Code), new CreateIndexOptions { Unique = true }));
        }

        public async ValueTask Add(VersionedProduct product)
        {
            await Collection.InsertOneAsync(product);
        }

        public async ValueTask<VersionedProduct?> FindById(string productId)
        {
            return await Collection.Find(x => x.Id == productId).FirstOrDefaultAsync();
        }
    }
}
