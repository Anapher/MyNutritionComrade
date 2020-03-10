using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using MyNutritionComrade.Core.Shared;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class Product : BaseEntity
    {
        private readonly List<ProductContribution> _productContributions = new List<ProductContribution>();
        private readonly List<ProductLabel> _productLabel = new List<ProductLabel>();
        private readonly List<ProductServing> _productServings = new List<ProductServing>();
        private string _defaultServing = "g";

        public Product()
        {
            NutritionInformation = NutritionInformation.Empty;
            Code = null;
        }

        /// <summary>
        ///     The product bar code
        /// </summary>
        public string? Code { get; private set; }

        /// <summary>
        ///     The nutrition information of the product
        /// </summary>
        public NutritionInformation NutritionInformation { get; private set; }

        /// <summary>
        ///     The current version of the product value
        /// </summary>
        public int Version { get; private set; }

        /// <summary>
        ///     The labels of the product, because equal products may have different labels depending on the location they are sold/synonyms
        /// </summary>
        public IEnumerable<ProductLabel> ProductLabel => _productLabel;

        /// <summary>
        ///     The serving sizes of the product (e. g. 1g, 1 unit, 1 package, ...)
        /// </summary>
        public IReadOnlyList<ProductServing> ProductServings => _productServings;

        /// <summary>
        ///     The contributions done to this product
        /// </summary>
        public IEnumerable<ProductContribution> ProductContributions => _productContributions;

        public ServingType DefaultServing
        {
            get => new ServingType(_defaultServing);
            set => _defaultServing = value.Name;
        }

        public ProductContribution AddContribution(User user, int sourceVersion, string jsonPatch)
        {
            var version = 0;
            if (_productContributions.Count > 0)
                version = _productContributions.Max(x => x.Version) + 1;

            var contribution = new ProductContribution(sourceVersion, jsonPatch, this, user, version);
            _productContributions.Add(contribution);

            return contribution;
        }

        public void ApplyContribution(ProductContribution productContribution, ProductDto productDto)
        {
            Code = productDto.Code;
            NutritionInformation = productDto.NutritionInformation;
            Version = productContribution.Version;

            _defaultServing = productDto.DefaultServingType;

            ProductUtils.PatchServings(this, _productServings, productDto.ServingTypes);
            ProductUtils.PatchLabels(this, _productLabel, productDto.Label);
        }

        public void AddProductLabel(string name, CultureInfo cultureInfo)
        {
            var label = new ProductLabel(this, name, cultureInfo);
            if (_productLabel.Any(x => x.LanguageCode == label.LanguageCode && x.NormalizedName == label.NormalizedName))
                throw new ArgumentException("This product label already exists.");

            _productLabel.Add(label);
        }

        public void RemoveProductLabel(int productLabelId)
        {
            _productLabel.Remove(_productLabel.First(x => x.Id == productLabelId));
        }

        public ProductServing AddProductServing(double weight, ServingType servingType)
        {
            if (_productServings.Any(x => Math.Abs(x.Weight - weight) < 1))
                throw new ArgumentException("A serving with the given mass already exists.");

            var serving = new ProductServing(weight, servingType, this);
            _productServings.Add(serving);
            return serving;
        }

        public void RemoveProductServing(int productServingId)
        {
            _productServings.Remove(_productServings.First(x => x.Id == productServingId));
        }
    }
}
