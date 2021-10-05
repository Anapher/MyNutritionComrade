using System.Collections.Generic;
using MyNutritionComrade.Models;
using Newtonsoft.Json;
using Xunit;

namespace CommunityCatalog.Core.Tests
{
    public class JsonConfigTests
    {
        // Haferflocken
        public static NutritionalInfo TestNutritionalInfo => new(100, 368, 7, 1.24, 58.7, 0.7, 13.5, 10.0, 0);

        public static ProductProperties TestProduct =>
            new("1234",
                new Dictionary<string, ProductLabel>
                {
                    { "de", new ProductLabel("Haferflocken", new[] { "Porridge" }) },
                }, TestNutritionalInfo,
                new Dictionary<ServingType, double>
                {
                    { ServingType.Gram, 1 }, { ServingType.Package, 500 }, { ServingType.Portion, 50 },
                }, ServingType.Portion, null);

        [Fact]
        public void Serialize_Deserialize_Works()
        {
            var product = TestProduct;
            var serialized = JsonConvert.SerializeObject(product, JsonConfig.Default);

            var deserialized = JsonConvert.DeserializeObject<ProductProperties>(serialized, JsonConfig.Default);

            Assert.Equal(serialized, JsonConvert.SerializeObject(deserialized, JsonConfig.Default));
        }
    }
}
