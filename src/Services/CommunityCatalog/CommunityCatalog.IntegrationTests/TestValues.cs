using System.Collections.Generic;
using MyNutritionComrade.Models;

namespace CommunityCatalog.IntegrationTests
{
    public static class TestValues
    {
        // Haferflocken
        public static NutritionalInfo TestNutritionalInfo =>
            new NutritionalInfo(100, 368, 7, 1.24, 58.7, 0.7, 13.5, 10.0, 0);

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
    }
}
