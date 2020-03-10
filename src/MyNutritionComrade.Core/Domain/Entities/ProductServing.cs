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
        private string _servingType;

        public ProductServing(double weight, ServingType servingType, Product product)
        {
            Weight = weight;
            _servingType = servingType.Name;
            Product = product;
            ProductId = product.Id;
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private ProductServing()
        {
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        public double Weight { get; private set; }
        public ServingType ServingType => new ServingType(_servingType);
        public int ProductId { get; private set; }
        public Product Product { get; private set; }

        public IEnumerable<ProductServingLabel> ProductServingLabels => _productServingLabels;

        public void AddLabel(string name, CultureInfo cultureInfo, string? pluralLabel = null)
        {
            var label = new ProductServingLabel(name, pluralLabel, cultureInfo);
            if (_productServingLabels.Any(x => x.LanguageCode == label.LanguageCode && x.NormalizedName == label.NormalizedName))
                throw new ArgumentException("The label already exists");

            _productServingLabels.Add(label);
        }

        public void RemoveLabel(int productServingLabelId)
        {
            _productServingLabels.Remove(_productServingLabels.First(x => x.Id == productServingLabelId));
        }
    }
}
