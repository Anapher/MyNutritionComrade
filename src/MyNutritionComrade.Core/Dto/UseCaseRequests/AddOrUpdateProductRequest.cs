using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class AddOrUpdateProductRequest : IUseCaseRequest<AddOrUpdateProductResponse>
    {
        public AddOrUpdateProductRequest(ProductInfo product, string? productId, int? productVersion, string userId)
        {
            Product = product;
            ProductId = productId;
            ProductVersion = productVersion;
            UserId = userId;
        }

        public ProductInfo Product { get; set; }
        public string? ProductId { get; set; }
        public int? ProductVersion { get; set; }
        public string UserId { get; set; }
    }
}
