using System.Globalization;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductServingAlias : LocalizedNamedEntry
    {
        public ProductServingAlias(ProductServing productServing, string name, CultureInfo cultureInfo): base(cultureInfo.Name, name)
        {
            ProductServing = productServing;
            ProductServingId = productServing.Id;
        }

        public ProductServing ProductServing { get; private set; }
        public int ProductServingId { get; private set; }
    }
}
