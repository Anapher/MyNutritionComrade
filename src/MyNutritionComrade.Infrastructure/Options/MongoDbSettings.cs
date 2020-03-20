namespace MyNutritionComrade.Infrastructure.Options
{
    public class MongoDbSettings
    {
        public string ProductsCollectionName { get; set; } = "products";
        public string ProductContributionsCollectionName { get; set; } = "product_contributions";
        public string ConnectionString { get; set; } = "mongodb://localhost:27017";
        public string DatabaseName { get; set; } = "nutritioncomrade";
    }
}
