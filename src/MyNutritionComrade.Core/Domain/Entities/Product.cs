using System;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class Product : ProductInfo
    {
        public Product(string id, int version)
        {
            Id = id;
            Version = version;
        }

        public Product()
        {
        }

        public Product(string id)
        {
            Id = id;
        }

        public string Id { get; private set; } = string.Empty;

        /// <summary>
        ///     The current version of the product value
        /// </summary>
        public int Version { get; set; }

        public DateTimeOffset CreatedOn { get; private set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset ModifiedOn { get; private set; } = DateTimeOffset.UtcNow;
    }
}
