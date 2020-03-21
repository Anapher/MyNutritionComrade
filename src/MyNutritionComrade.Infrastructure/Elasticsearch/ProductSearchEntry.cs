using System.Collections.Generic;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using Nest;
#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

namespace MyNutritionComrade.Infrastructure.Elasticsearch
{
    [ElasticsearchType(RelationName = "product")]
    public class ProductSearchEntry
    {
        [Keyword]
        public int Id { get; set; }

        [Text]
        public string[] ProductName { get; set; }

        [Object(Enabled = false)]
        public NutritionInformation NutritionInformation { get; set; }

        [Keyword]
        public string[] Tags { get; set; }

        [Keyword]
        public string[] ServingTypes { get; set; }

        [Object(Enabled = false)]
        public Dictionary<string, double> Servings { get; set; }

        [Object(Enabled = false)]
        public List<ProductLabel> ProductLabels { get; set; }

        [Object(Enabled = false)]
        public string DefaultServingType { get; set; }
    }
}
