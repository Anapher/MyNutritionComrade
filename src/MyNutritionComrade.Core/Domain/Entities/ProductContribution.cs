using System;
using System.Collections.Generic;
using System.Linq;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductContribution
    {
        public ProductContribution(string userId, string productId, IEnumerable<PatchOperation> patch)
        {
            UserId = userId;
            ProductId = productId;
            Patch = patch.OrderBy(x => x.Type).ThenBy(x => x.Path).ToList();
            PatchHash = HashUtils.GetMd5ForObject(Patch);
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private ProductContribution()
        {
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        public string Id { get; private set; } = string.Empty;
        public string UserId { get; private set; }

        public ProductContributionStatus Status { get; private set; } = ProductContributionStatus.Pending;
        public string? StatusDescription { get; private set; }
        public int? AppliedVersion { get; private set; }

        public string ProductId { get; private set; }
        public string PatchHash { get; private set; }

        /// <summary>
        ///     A json patch document that updates the product
        /// </summary>
        public List<PatchOperation> Patch { get; private set; }

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
