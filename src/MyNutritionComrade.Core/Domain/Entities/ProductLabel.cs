using System.Globalization;

namespace MyNutritionComrade.Core.Domain.Entities
{
    /// <summary>
    ///     A product label in a specific language (= the product name)
    /// </summary>
    public class ProductLabel
    {
        public ProductLabel(string label, string languageCode)
        {
            Label = label;
            LanguageCode = languageCode;
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private ProductLabel()
        {
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        /// <summary>
        ///     Retrieved from <see cref="CultureInfo.Name" />. The culture name in the format languagecode2-(country/regioncode2).
        ///     languagecode2 is a lowercase two-letter code derived from ISO 639-1. country/regioncode2 is derived from ISO 3166
        ///     and usually consists of two uppercase letters, or a BCP-47 language tag.
        /// </summary>
        public string LanguageCode { get; private set; }

        /// <summary>
        ///     The name localized with <see cref="LanguageCode" />
        /// </summary>
        public string Label { get; private set; }
    }
}
