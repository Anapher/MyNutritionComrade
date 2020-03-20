using System;
using System.Collections.Generic;
using MongoDB.Bson;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductContribution
    {
        public ProductContribution(string userId, string productId, BsonDocument patch)
        {
            UserId = userId;
            ProductId = productId;
            Patch = patch;
        }

        public string Id { get; private set; } = string.Empty;
        public string UserId { get; private set; }

        public ProductContributionStatus Status { get; set; }
        public int? AppliedVersion { get; private set; }

        public string ProductId { get; private set; }

        /// <summary>
        ///     A json patch document that updates the product with version <see cref="SourceVersion" /> to <see cref="Version" />
        /// </summary>
        public BsonDocument Patch { get; private set; }

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
