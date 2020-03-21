using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class Product : ProductInfo
    {
        public string Id { get; private set; } = string.Empty;

        /// <summary>
        ///     The current version of the product value
        /// </summary>
        public int Version { get; private set; }

        /// <summary>
        ///     All pending contributions and the current product contribution
        /// </summary>
        public List<ProductContribution> Contributions { get; private set; } = new List<ProductContribution>();

        public DateTimeOffset CreatedOn { get; private set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset ModifiedOn { get; private set; } = DateTimeOffset.UtcNow;

        public void AddProductLabel(string name, CultureInfo cultureInfo)
        {
            var label = new ProductLabel(name, cultureInfo);
            if (_label.Any(x => x.LanguageCode == label.LanguageCode && x.Label.NormalizeString() == label.Label.NormalizeString()))
                throw new ArgumentException("This product label already exists.");

            _label.Add(label);
        }

        public void RemoveProductLabel(ProductLabel productLabel)
        {
            _label.Remove(productLabel);
        }

        public void AddProductServing(double weight, ServingType servingType)
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
