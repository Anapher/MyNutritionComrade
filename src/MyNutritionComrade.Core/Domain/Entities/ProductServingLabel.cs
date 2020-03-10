using System.Globalization;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductServingLabel : LocalizedNamedEntry
    {
        public ProductServingLabel(string name, string? pluralLabel, CultureInfo cultureInfo) : base(cultureInfo.Name, name)
        {
            PluralLabel = pluralLabel;
        }

        public string? PluralLabel { get; set; }
    }
}
