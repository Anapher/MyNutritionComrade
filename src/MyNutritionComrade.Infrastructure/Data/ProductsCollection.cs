using Microsoft.Extensions.Options;
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

        public IMongoCollection<Product> Products { get; }
        public IMongoCollection<ProductContribution> ProductContributions { get; }
    }
}
