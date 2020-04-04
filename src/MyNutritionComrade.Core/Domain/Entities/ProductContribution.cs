using System;
using System.Collections.Generic;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductContribution
    {
        public ProductContribution(string userId, string productId, List<PatchOperation> patch)
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

        public ProductContributionStatus Status { get; private set; }
        public string? StatusDescription { get; private set; }
        public int? AppliedVersion { get; private set; }

        public string ProductId { get; private set; }

        /// <summary>
        ///     A json patch document that updates the product
        /// </summary>
        public List<PatchOperation> Patch { get; private set; }

        public List<ProductContributionVote> Votes { get; private set; } = new List<ProductContributionVote>();

        public DateTimeOffset CreatedOn { get; set; } = DateTimeOffset.UtcNow;

        public void Apply(int version, string? description = null)
        {
            Status = ProductContributionStatus.Applied;
            StatusDescription = description;
            AppliedVersion = version;
        }

        public void Reject(string? description = null)
        {
            Status = ProductContributionStatus.Rejected;
            StatusDescription = description;
        }
    }

    public enum ProductContributionStatus
    {
        Pending,
        Applied,
        Rejected
    }
}
