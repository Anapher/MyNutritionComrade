using System;
using System.Collections.Generic;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductContribution
    {
        public ProductContribution(string userId, string productId, string patch)
        {
            UserId = userId;
            ProductId = productId;
            Patch = patch;
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private ProductContribution()
        {
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        public string Id { get; private set; } = string.Empty;
        public string UserId { get; private set; }

        public ProductContributionStatus Status { get; set; }
        public int? AppliedVersion { get; private set; }

        public string ProductId { get; private set; }

        /// <summary>
        ///     A json patch document that updates the product
        /// </summary>
        public string Patch { get; private set; }

        public DateTimeOffset CreatedOn { get; set; } = DateTimeOffset.UtcNow;
        public IList<ProductContributionApproval> Approvals { get; set; } = new List<ProductContributionApproval>();

        public void Apply(int version)
        {
            Status = ProductContributionStatus.Applied;
            AppliedVersion = version;
        }

        public void Reject()
        {
            Status = ProductContributionStatus.Rejected;
        }
    }

    public enum ProductContributionStatus
    {
        Pending,
        Applied,
        Rejected
    }
}
