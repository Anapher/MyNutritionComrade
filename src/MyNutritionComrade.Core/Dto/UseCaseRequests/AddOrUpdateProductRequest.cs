using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class AddOrUpdateProductRequest : IUseCaseRequest<AddOrUpdateProductResponse>
    {
        public AddOrUpdateProductRequest(ProductDto productDto, int? productId, int? productVersion, string userId)
        {
            ProductDto = productDto;
            ProductId = productId;
            ProductVersion = productVersion;
            UserId = userId;
        }

        public ProductDto ProductDto { get; set; }
        public int? ProductId { get; set; }
        public int? ProductVersion { get; set; }
        public string UserId { get; set; }
    }
}
