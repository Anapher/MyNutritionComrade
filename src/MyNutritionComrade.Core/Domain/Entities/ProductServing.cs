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

        public ProductServing(double weight, ServingType servingType)
        {
            Weight = weight;
            ServingType = servingType;
        }

        public double Weight { get; private set; }
        public ServingType? ServingType { get; private set; }
        public IEnumerable<ProductServingLabel> ProductServingLabels => _productServingLabels;

        public void AddLabel(string name, CultureInfo cultureInfo)
        {
            var label = new ProductServingLabel(name, cultureInfo);
            if (_productServingLabels.Any(x => x.LanguageCode == label.LanguageCode && x.NormalizedName == label.NormalizedName))
                throw new ArgumentException("The label already exists");

            _productServingLabels.Add(label);
        }

        public void RemoveLabel(int productServingLabelId)
        {
            _productServingLabels.Remove(_productServingLabels.First(x => x.Id == productServingLabelId));
        }
    }

    public class ServingType
    {
        public ServingType(string name)
        {
            Name = name;
        }

        public string Name { get; }

        public static ServingType Slice = new ServingType("slice");
        public static ServingType Piece = new ServingType("piece");
    }
}
