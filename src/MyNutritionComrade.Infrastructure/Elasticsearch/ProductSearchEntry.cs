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
        public string Id { get; set; }

        [Text]
        public string[] ProductName { get; set; }

        [Keyword]
        public string[] Tags { get; set; }

        [Keyword]
        public string[] ServingTypes { get; set; }

        // Data, disabled indexing
        public NutritionalInfo NutritionalInfo { get; set; }
        public Dictionary<string, double> Servings { get; set; }
        public List<ProductLabel> Label { get; set; }

        [Keyword(Index = false)]
        public string DefaultServing { get; set; }
    }
}
