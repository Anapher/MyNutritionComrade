using System.Globalization;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductServingLabel : LocalizedNamedEntry
    {
        public ProductServingLabel(string name, CultureInfo cultureInfo) : base(cultureInfo.Name, name)
        {
        }
    }
}
