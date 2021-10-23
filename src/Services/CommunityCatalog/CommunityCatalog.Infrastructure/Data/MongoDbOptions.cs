using System.Collections.Generic;

namespace CommunityCatalog.Infrastructure.Data
{
    public class MongoDbOptions
    {
        public string ConnectionString { get; set; } = "mongodb://localhost:27017";

        public string DatabaseName { get; set; } = "MyNutritionComrade";

        public Dictionary<string, string> CollectionNames { get; set; } = new() { { "ProductDocument", "Product" } };
    }
}
