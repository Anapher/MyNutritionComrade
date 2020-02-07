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
        private readonly List<ProductLabel> _productLabels = new List<ProductLabel>();
        private readonly List<ProductServing> _productServings = new List<ProductServing>();

        public Product(ProductValue value, User user)
        {
            NutritionInformation = NutritionInformation.Empty;
            Code = null;

            var contribution = AddContribution(value, user, Version);
            ApplyContribution(contribution);
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private Product()
        {
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

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
        public int Version { get; private set; } = 0;

        /// <summary>
        ///     The value of the product
        /// </summary>
        public ProductValue Value => new ProductValue(NutritionInformation, Code);

        /// <summary>
        ///     The labels of the product, because equal products may have different labels depending on the location they are sold
        /// </summary>
        public IEnumerable<ProductLabel> ProductLabels => _productLabels;

        /// <summary>
        ///     The serving sizes of the product (e. g. 1g, 1 unit, 1 package, ...)
        /// </summary>
        public IEnumerable<ProductServing> ProductServings => _productServings;

        /// <summary>
        ///     The contributions done to this product
        /// </summary>
        public IEnumerable<ProductContribution> ProductContributions => _productContributions;

        public ProductContribution AddContribution(ProductValue newValue, User user, int versionBase)
        {
            var version = (_productContributions.Count == 0 ? 0 : _productContributions.Max(x => x.SourceVersion)) + 1;
            var basedValue = versionBase == Version ? Value : _productContributions.First(x => x.Version == versionBase).NewValue;
            var jsonPatch = ProductValueUtils.CreateJsonPatchDocument(basedValue, newValue);

            var contribution = new ProductContribution(versionBase, jsonPatch, newValue, this, user, version);
            _productContributions.Add(contribution);

            if (user.IsTrustworthy)
                ApplyContribution(contribution);

            return contribution;
        }

        public void ApplyContribution(ProductContribution contribution)
        {
            Code = contribution.NewValue.Code;
            NutritionInformation = contribution.NewValue.NutritionInformation;
            Version = contribution.Version;
        }

        public void AddProductLabel(string name, CultureInfo cultureInfo)
        {
            var label = new ProductLabel(this, name, cultureInfo);
            if (_productLabels.Any(x => x.LanguageCode == label.LanguageCode && x.NormalizedName == label.NormalizedName))
                throw new ArgumentException("This product label already exists.");

            _productLabels.Add(label);
        }

        public void RemoveProductLabel(int productLabelId)
        {
            _productLabels.Remove(_productLabels.First(x => x.Id == productLabelId));
        }

        public ProductServing AddProductServing(double mass)
        {
            if (_productServings.Any(x => Math.Abs(x.Mass - mass) < 1))
                throw new ArgumentException("A serving with the given mass already exists.");

            var serving = new ProductServing(this, mass);
            _productServings.Add(serving);
            return serving;
        }

        public void RemoveProductServing(int productServingId)
        {
            _productServings.Remove(_productServings.First(x => x.Id == productServingId));
        }
    }

    public class ProductValue
    {
        public ProductValue(NutritionInformation nutritionInformation, string? code)
        {
            NutritionInformation = nutritionInformation;
            Code = code;
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private ProductValue()
        {
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        public NutritionInformation NutritionInformation { get; private set; }
        public string? Code { get; private set; }
        public IList<LocalizedLabel> Label { get; private set; }
        public IList<ServingDto> Type { get; private set; }

        protected bool Equals(ProductValue other) => NutritionInformation.Equals(other.NutritionInformation) && Code == other.Code;

        public override bool Equals(object? obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != GetType()) return false;
            return Equals((ProductValue) obj);
        }

        public override int GetHashCode() => HashCode.Combine(NutritionInformation, Code);
    }

    public class ServingDto
    {
        public double Mass { get; set; }
        public IList<ItemLocalizedLabel> Labels { get; set; }
        public IList<ItemLocalizedLabel> Aliases { get; set; }
    }

    public class LocalizedLabel
    {
        public string Label { get; set; }
        public string LanguageCode { get; set; }
    }

    public class ItemLocalizedLabel : LocalizedLabel
    {
        public string PluralLabel { get; set; }
    }
}
