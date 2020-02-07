using MyNutritionComrade.Core.Shared;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductContribution : BaseEntity
    {
        public ProductContribution(int sourceVersion, string jsonPatch, ProductValue newValue, Product product, User user, int version)
        {
            ProductId = product.Id;
            SourceVersion = sourceVersion;
            JsonPatch = jsonPatch;
            UserId = user.Id;
            NewValue = newValue;
            Product = product;
            User = user;
            Version = version;
        }

        public int ProductId { get; set; }
        public int SourceVersion { get; set; }

        public string JsonPatch { get; private set; }
        public string UserId { get; private set; }

        public ProductValue NewValue { get; set; }
        public int Version { get; private set; }

        public Product Product { get; private set; }
        public User User { get; private set; }
    }

    public class ProductContributionApproval : BaseEntity
    {
        public int ProductContributionId { get; set; }
        public int UserId { get; set; }
        public bool Approve { get; set; }
    }
}
