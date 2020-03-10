using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Dto.UseCaseResponses
{
    public class AddOrUpdateProductResponse
    {
        public AddOrUpdateProductResponse(Product product)
        {
            Product = product;
        }

        public Product Product { get; }
    }
}
