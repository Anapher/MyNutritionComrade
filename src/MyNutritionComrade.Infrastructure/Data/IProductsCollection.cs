using MongoDB.Driver;

namespace MyNutritionComrade.Infrastructure.Data
{
    public interface IProductsCollection
    {
        IMongoCollection<OpenFoodFactsProduct> Products { get; }
    }
}