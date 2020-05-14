using System;
using System.Collections.Immutable;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ConsumedProduct : Consumed
    {
        public ConsumedProduct(string userId, DateTime date, ConsumptionTime time, string productId, NutritionalInfo nutritionalInfo,
            IImmutableSet<string> tags) : base(userId, date, time, nutritionalInfo)
        {
            ProductId = productId;
            NutritionalInfo = nutritionalInfo;
            Tags = tags;
        }

        public string ProductId { get; private set; }

        /// <summary>
        ///     Important to represent product correctly
        /// </summary>
        public IImmutableSet<string> Tags { get; private set; }

        public static ConsumedProduct FromProduct(Product product, double volume, string userId, DateTime date, ConsumptionTime time)
        {
            var nutritionalInfo = product.NutritionalInfo.ChangeVolume(volume);
            return new ConsumedProduct(userId, date, time, product.Id, nutritionalInfo, product.Tags.ToImmutableHashSet());
        }
    }
}
