using System.Globalization;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductServingLabel : LocalizedNamedEntry
    {
        public ProductServingLabel(ProductServing serving, string name, CultureInfo cultureInfo) : base(cultureInfo.Name, name)
        {
            ProductServing = serving;
            ProductServingId = serving.Id;
        }

        public int ProductServingId { get; private set; }
        public ProductServing ProductServing { get; private set; }
    }
}
