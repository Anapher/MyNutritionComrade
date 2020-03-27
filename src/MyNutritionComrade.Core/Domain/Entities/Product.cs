﻿using System;
using System.Collections.Generic;

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

        public string Id { get; private set; } = string.Empty;

        /// <summary>
        ///     The current version of the product value
        /// </summary>
        public int Version { get; private set; }

        /// <summary>
        ///     All pending contributions and the current product contribution
        /// </summary>
        public List<ProductContribution> Contributions { get; set; } = new List<ProductContribution>();

        public DateTimeOffset CreatedOn { get; private set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset ModifiedOn { get; private set; } = DateTimeOffset.UtcNow;
    }
}
