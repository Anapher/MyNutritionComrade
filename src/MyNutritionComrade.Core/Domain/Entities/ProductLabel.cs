using System.Globalization;

namespace MyNutritionComrade.Core.Domain.Entities
{
    /// <summary>
    ///     A product label in a specific language (= the product name)
    /// </summary>
    public class ProductLabel : LocalizedNamedEntry
    {
        public ProductLabel(Product product, string name, CultureInfo cultureInfo) : base(cultureInfo.Name, name)
        {
            Product = product;
            ProductId = product.Id;
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private ProductLabel()
        {
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        public int ProductId { get; private set; }
        public Product Product { get; private set; }
    }
}
