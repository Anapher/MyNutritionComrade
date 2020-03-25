using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.Domain
{
    public class ProductInfo
    {
        private string _defaultServing = "g";
        private List<ProductLabel> _label = new List<ProductLabel>();
        private Dictionary<ServingType, double> _servings = new Dictionary<ServingType, double>();

        public ProductInfo()
        {
            NutritionInformation = NutritionInformation.Empty;
            Code = null;
        }

        /// <summary>
        ///     The product bar code
        /// </summary>
        public string? Code { get; set; }

        /// <summary>
        ///     The nutrition information of the product
        /// </summary>
        public NutritionInformation NutritionInformation { get; set; }

        /// <summary>
        ///     The labels of the product, because equal products may have different labels depending on the location they are
        ///     sold/synonyms
        /// </summary>
        public IReadOnlyList<ProductLabel> Label
        {
            get => _label; private set => _label = value.ToList();
        }

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

        public void AddProductLabel(string name, CultureInfo cultureInfo)
        {
            var label = new ProductLabel(name, cultureInfo.TwoLetterISOLanguageName);
            if (_label.Any(x => x.LanguageCode == label.LanguageCode && x.Value.NormalizeString() == label.Value.NormalizeString()))
                throw new ArgumentException("This product label already exists.");

            _label.Add(label);
        }

        public void RemoveProductLabel(ProductLabel productLabel)
        {
            _label.Remove(productLabel);
        }

        public void AddProductServing(ServingType servingType, double weight)
        {
            if (_servings.ContainsKey(servingType))
                throw new ArgumentException("A serving with the given mass already exists.");

            _servings.Add(servingType, weight);
        }

        public void RemoveProductServing(ServingType servingType)
        {
            _servings.Remove(servingType);
        }
    }
}
