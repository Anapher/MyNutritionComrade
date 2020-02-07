using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MyNutritionComrade.Infrastructure.Options;

namespace MyNutritionComrade.Infrastructure.Data
{
    public class ProductsCollection : IProductsCollection
    {
        public ProductsCollection(IOptions<ProductsDatabaseSettings> options)
        {
            var client = new MongoClient(options.Value.ConnectionString);
            var database = client.GetDatabase(options.Value.DatabaseName);

            Products = database.GetCollection<OpenFoodFactsProduct>(options.Value.ProductsCollectionName);
        }

        public IMongoCollection<OpenFoodFactsProduct> Products { get; }
    }
}
