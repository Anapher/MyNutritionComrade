using System;
using MyNutritionComrade.Core.Extensions;

namespace MyNutritionComrade.Core.Domain.Entities
{
    /// <summary>
    ///     A product label in a specific language (= the product name)
    /// </summary>
    public class ProductLabel
    {
        public ProductLabel(string value, string[]? tags = null)
        {
            Value = value;
            Tags = tags ?? new string[0];
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private ProductLabel()
        {
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        /// <summary>
        ///     The localized name
        /// </summary>
        public string Value { get; private set; }

        /// <summary>
        ///     Space separated keywords
        /// </summary>
        public string[] Tags { get; private set; }

        protected bool Equals(ProductLabel other) => Value == other.Value && Tags.ScrambledEquals(other.Tags);

        public override bool Equals(object? obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((ProductLabel) obj);
        }

        public override int GetHashCode() => HashCode.Combine(Value, Tags.ScrambledHashCode());
    }
}
