using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using MyNutritionComrade.Core.Shared;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductServing : BaseEntity
    {
        private readonly List<ProductServingLabel> _productServingLabels = new List<ProductServingLabel>();
        private readonly List<ProductServingAlias> _productServingAliases = new List<ProductServingAlias>();

        public ProductServing(Product product, double mass)
        {
            Product = product;
            ProductId = product.Id;
            Mass = mass;
        }

        public int ProductId { get; private set; }
        public Product Product { get; private set; }

        public double Mass { get; private set; }

        public IEnumerable<ProductServingLabel> ProductServingLabels => _productServingLabels;
        public IEnumerable<ProductServingAlias> ProductServingAliases => _productServingAliases;

        public void AddLabel(string name, CultureInfo cultureInfo)
        {
            var label = new ProductServingLabel(this, name, cultureInfo);
            if (_productServingLabels.Any(x => x.LanguageCode == label.LanguageCode && x.NormalizedName == label.NormalizedName))
                throw new ArgumentException("The label already exists");

            _productServingLabels.Add(label);
        }

        public void RemoveLabel(int productServingLabelId)
        {
            _productServingLabels.Remove(_productServingLabels.First(x => x.Id == productServingLabelId));
        }

        public void AddServingAlias(string name, CultureInfo cultureInfo)
        {
            var alias = new ProductServingAlias(this, name, cultureInfo);
            if (_productServingAliases.Any(x => x.LanguageCode == alias.LanguageCode && x.NormalizedName == alias.NormalizedName))
                throw new ArgumentException("The alias already exists");

            _productServingAliases.Add(alias);
        }

        public void RemoveAlias(int productServingAliasId)
        {
            _productServingAliases.Remove(_productServingAliases.First(x => x.Id == productServingAliasId));
        }
    }
}
