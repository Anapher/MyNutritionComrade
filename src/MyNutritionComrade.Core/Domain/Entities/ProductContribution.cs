using System.Collections.Generic;
using MyNutritionComrade.Core.Shared;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductContribution : BaseEntity
    {
        public ProductContribution(int sourceVersion, string jsonPatch, Product product, User user, int version)
        {
            ProductId = product.Id;
            SourceVersion = sourceVersion;
            JsonPatch = jsonPatch;
            UserId = user.Id;
            Product = product;
            User = user;
            Version = version;
        }

        public int ProductId { get; set; }
        public int SourceVersion { get; set; }

        /// <summary>
        ///     A json patch document that updates the product with version <see cref="SourceVersion"/> to <see cref="Version"/>
        /// </summary>
        public string JsonPatch { get; private set; }
        public string UserId { get; private set; }

        public int Version { get; private set; }

        public Product Product { get; private set; }
        public User User { get; private set; }

        public IList<ProductContributionApproval> Approvals { get; set; } = new List<ProductContributionApproval>();
    }
}
