using System.Collections.Generic;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Domain
{
    public class ProductInfo
    {
        protected readonly List<ProductLabel> _label = new List<ProductLabel>();
        protected readonly Dictionary<ServingType, double> _servings = new Dictionary<ServingType, double>();
        protected readonly HashSet<string> _tags = new HashSet<string>();
        private string _defaultServing = "g";

        public ProductInfo()
        {
            NutritionInformation = NutritionInformation.Empty;
            Code = null;
        }

        /// <summary>
        ///     The product bar code
        /// </summary>
        public string? Code { get; protected set; }

        /// <summary>
        ///     The nutrition information of the product
        /// </summary>
        public NutritionInformation NutritionInformation { get; protected set; }

        /// <summary>
        ///     The labels of the product, because equal products may have different labels depending on the location they are
        ///     sold/synonyms
        /// </summary>
        public IReadOnlyList<ProductLabel> Label => _label;

        /// <summary>
        ///     The serving sizes of the product (e. g. 1g, 1 unit, 1 package, ...)
        /// </summary>
        public IReadOnlyDictionary<ServingType, double> Servings => _servings;

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
        public ISet<string> Tags => _tags;
    }
}
