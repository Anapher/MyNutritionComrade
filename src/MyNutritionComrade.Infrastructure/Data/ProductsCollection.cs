using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Driver;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Infrastructure.Options;

namespace MyNutritionComrade.Infrastructure.Data
{
    public class ProductsCollection : IProductsCollection
    {
        public ProductsCollection(IOptions<MongoDbSettings> options)
        {
            var client = new MongoClient(options.Value.ConnectionString);
            var database = client.GetDatabase(options.Value.DatabaseName);

            Products = database.GetCollection<Product>(options.Value.ProductsCollectionName);
            ProductContributions = database.GetCollection<ProductContribution>(options.Value.ProductContributionsCollectionName);
        }

        static ProductsCollection()
        {
            BsonClassMap.RegisterClassMap<Product>(x =>
            {
                x.AutoMap();
                x.MapIdMember(x => x.Id).SetIdGenerator(new GuidGenerator());
            });

            BsonClassMap.RegisterClassMap<ProductContribution>(x =>
            {
                x.AutoMap();
                x.MapIdMember(x => x.Id).SetIdGenerator(new GuidGenerator());
            });
        }

        public async Task Setup()
        {
            var productCodeKey = Builders<Product>.IndexKeys.Text(x => x.Code);
            var productCodeModel = new CreateIndexModel<Product>(productCodeKey, new CreateIndexOptions {Unique = true});

            await Products.Indexes.CreateOneAsync(productCodeModel);
        }

        public IMongoCollection<Product> Products { get; }
        public IMongoCollection<ProductContribution> ProductContributions { get; }
    }
}
