namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ItemLocalizedLabel : LocalizedLabel
    {
        public ItemLocalizedLabel(string label, string languageCode, string? pluralLabel = null) : base(label, languageCode)
        {
            PluralLabel = pluralLabel;
        }

        public string? PluralLabel { get; private set; }
    }
}