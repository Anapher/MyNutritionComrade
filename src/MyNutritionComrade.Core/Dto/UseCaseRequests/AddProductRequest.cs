using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class AddProductRequest : IUseCaseRequest<AddProductResponse>
    {
        public AddProductRequest(ProductInfo product, string userId)
        {
            Product = product;
            UserId = userId;
        }

        public ProductInfo Product { get; }
        public string UserId { get; }

        /// <summary>
        ///     The id the product should have in the database. This field is especially meant for automatic imports.
        /// </summary>
        public string? RequestedProductId { get; set; }
    }
}
