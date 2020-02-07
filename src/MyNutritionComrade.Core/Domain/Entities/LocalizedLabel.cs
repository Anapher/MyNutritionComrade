namespace MyNutritionComrade.Core.Domain.Entities
{
    public class LocalizedLabel
    {
        public LocalizedLabel(string label, string languageCode)
        {
            Label = label;
            LanguageCode = languageCode;
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private LocalizedLabel()
        {
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        public string Label { get; private set; }
        public string LanguageCode { get; private set; }
    }
}