using System.Threading.Tasks;
using MongoDB.Driver;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Infrastructure.Data;

namespace MyNutritionComrade.Infrastructure.MongoDb
{
    public class MongoDbInitializer : IMongoDbInitializer
    {
        private readonly IProductsCollection _productsCollection;

        public MongoDbInitializer(IProductsCollection productsCollection)
        {
            _productsCollection = productsCollection;
        }

        public async Task Setup()
        {
            var productCodeKey = Builders<Product>.IndexKeys.Ascending(x => x.Code);
            var productCodeModel = new CreateIndexModel<Product>(productCodeKey, new CreateIndexOptions {Unique = true, Sparse = true});

            await _productsCollection.Products.Indexes.CreateOneAsync(productCodeModel);
        }
    }
}
