#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

using System.Linq;
using MyNutritionComrade.Core.Domain.Entities;
using Raven.Client.Documents.Indexes;

namespace MyNutritionComrade.Infrastructure.Data.Indexes
{
    public class Product_BySearchProps : AbstractIndexCreationTask<Product, Product_BySearchProps.Result>
    {
        public Product_BySearchProps()
        {
            Map = products => from product in products
                select new
                {
                    ProductName = product.Label.Select(x => x.Value.Value).ToArray(),
                    ProductNameTags = product.Label.Select(x => string.Join(' ', x.Value.Tags)).ToArray(),
                    Tags = product.Tags.ToArray(),
                    Servings = product.Servings.Select(x => x.Key).ToArray()
                };

            Index(x => x.ProductName, FieldIndexing.Search);
            Index(x => x.ProductNameTags, FieldIndexing.Search);
        }

        public class Result
        {
            public string[] ProductName { get; set; }
            public string[] ProductNameTags { get; set; }
            public string[] Tags { get; set; }
            public string[] Servings { get; set; }
        }
    }
}
