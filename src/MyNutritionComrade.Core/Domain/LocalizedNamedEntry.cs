using System.Globalization;
using MyNutritionComrade.Core.Shared;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.Domain
{
    public abstract class LocalizedNamedEntry : BaseEntity
    {
        protected LocalizedNamedEntry(string languageCode, string name)
        {
            LanguageCode = languageCode;
            SetName(name);
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        protected LocalizedNamedEntry()
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
        public string Name { get; private set; } = string.Empty;

        /// <summary>
        ///     A normalized version of the name used for internal purposes
        /// </summary>
        public string NormalizedName { get; private set; } = string.Empty;

        /// <summary>
        ///     Change the name
        /// </summary>
        /// <param name="name">The new name that should be applied</param>
        public virtual void SetName(string name)
        {
            Name = name;
            NormalizedName = name.NormalizeString();
        }
    }
}
