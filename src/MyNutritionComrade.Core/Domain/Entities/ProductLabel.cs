﻿using System;
using System.Globalization;

namespace MyNutritionComrade.Core.Domain.Entities
{
    /// <summary>
    ///     A product label in a specific language (= the product name)
    /// </summary>
    public class ProductLabel
    {
        public ProductLabel(string value, string languageCode)
        {
            Value = value;
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
        public string Value { get; private set; }

        protected bool Equals(ProductLabel other) => LanguageCode == other.LanguageCode && Value == other.Value;

        public override bool Equals(object? obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((ProductLabel)obj);
        }

        public override int GetHashCode() => HashCode.Combine(LanguageCode, Value);
    }
}
