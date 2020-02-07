using System.Collections.Generic;
using MyNutritionComrade.Core.Shared;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductServing : BaseEntity
    {
        public ProductServing(Product product, double mass)
        {
            Product = product;
            ProductId = product.Id;
            Mass = mass;
        }

        public int ProductId { get; private set; }
        public Product Product { get; private set; }

        public double Mass { get; private set; }

        public IEnumerable<ProductServingLabel>? ProductServingLabels { get; private set; }
        public IEnumerable<ProductServingAlias>? ProductServingAliases { get; private set; }
    }
}
