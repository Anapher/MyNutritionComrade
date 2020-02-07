namespace MyNutritionComrade.Infrastructure.Options
{
    public class ProductsDatabaseSettings
    {
        public string ProductsCollectionName { get; set; } = "products";
        public string ConnectionString { get; set; } = "mongodb://localhost:27017";
        public string DatabaseName { get; set; } = "nutritioncomrade";
    }
}
