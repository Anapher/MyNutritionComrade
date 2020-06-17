using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Domain
{
    public class ProductInfo
    {
        /// <summary>
        ///     This tag defines this product as a liquid substance
        /// </summary>
        public const string TagLiquid = "liquid";

        /// <summary>
        ///     Get all allowed tags for a product
        /// </summary>
        public static readonly ISet<string> AllowedTags = new HashSet<string>(new List<string> {TagLiquid});

        private string _defaultServing = string.Empty;
        private Dictionary<ServingType, double> _servings = new Dictionary<ServingType, double>();

        public ProductInfo()
        {
            NutritionalInfo = NutritionalInfo.Empty;
            Code = null;
        }

        /// <summary>
        ///     The product bar code
        /// </summary>
        public string? Code { get; set; }

        /// <summary>
        ///     The nutrition information of the product
        /// </summary>
        public NutritionalInfo NutritionalInfo { get; set; }

        /// <summary>
        /// <para>
        ///     The labels of the product, because equal products may have different labels depending on the location they are
        ///     sold/synonyms.
        /// </para>
        /// <para>
        ///     Key: Retrieved from <see cref="CultureInfo.TwoLetterISOLanguageName" />. The culture name in the format
        ///     languagecode2-(country/regioncode2).
        ///     languagecode2 is a lowercase two-letter code derived from ISO 639-1. country/regioncode2 is derived from ISO 3166
        ///     and usually consists of two uppercase letters, or a BCP-47 language tag.
        /// </para>
        /// </summary>
        public Dictionary<string, ProductLabel> Label { get; private set; } = new Dictionary<string, ProductLabel>();

        /// <summary>
        ///     The serving sizes of the product (e. g. 1g, 1 unit, 1 package, ...)
        /// </summary>
        public IReadOnlyDictionary<ServingType, double> Servings
        {
            get => _servings;
            private set => _servings = value.ToDictionary(x => x.Key, x => x.Value);
        }

        /// <summary>
        ///     The default serving referencing a key in <see cref="Servings" />
        /// </summary>
        public ServingType DefaultServing
        {
            get => new ServingType(_defaultServing);
            set => _defaultServing = value.Name;
        }

        /// <summary>
        ///     Tags of the product
        /// </summary>
        public ISet<string> Tags { get; private set; } = new HashSet<string>();

        public void AddProductServing(ServingType servingType, double weight)
        {
            if (_servings.ContainsKey(servingType))
                throw new ArgumentException("A serving with the given volume already exists.");

            _servings.Add(servingType, weight);
        }

        public void RemoveProductServing(ServingType servingType)
        {
            _servings.Remove(servingType);
        }
    }
}
