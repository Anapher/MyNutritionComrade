using System.Linq;
using MyNutritionComrade.Core.Domain.Entities;
using Raven.Client.Documents.Indexes;

namespace MyNutritionComrade.Infrastructure.Data.Indexes
{
    public class Product_ByCode : AbstractIndexCreationTask<Product>
    {
        public class Result
        {
            public string? Code { get; set; }
        }

        public Product_ByCode()
        {
            Map = products => from product in products select new {product.Code};
            Index(x => x.Code, FieldIndexing.Exact);
        }
    }
}
