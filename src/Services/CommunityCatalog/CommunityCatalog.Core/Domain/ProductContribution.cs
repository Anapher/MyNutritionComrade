using System;
using System.Collections.Generic;
using System.Linq;
using CommunityCatalog.Core.Utilities;
using Microsoft.AspNetCore.JsonPatch.Operations;

namespace CommunityCatalog.Core.Domain
{
    public record ProductContribution(string Id, string UserId, string ProductId, string PatchHash,
        ProductContributionStatus Status, string? StatusDescription, int? AppliedOnVersion,
        IReadOnlyList<Operation> Operations, DateTimeOffset CreatedOn)
    {
        public static ProductContribution Create(string userId, string productId, IReadOnlyList<Operation> operations)
        {
            var patchHash = HashUtils.GetMd5ForObject(operations.OrderBy(x => x.path).ThenBy(x => x.op));

            return new ProductContribution(string.Empty, userId, productId, patchHash,
                ProductContributionStatus.Pending, null, null, operations, DateTimeOffset.UtcNow);
        }

        public ProductContribution Applied(int version, string? description)
        {
            return this with
            {
                AppliedOnVersion = version,
                Status = ProductContributionStatus.Applied,
                StatusDescription = description,
            };
        }

        public ProductContribution Reject(string? description)
        {
            return this with { Status = ProductContributionStatus.Rejected, StatusDescription = description };
        }
    }
}
