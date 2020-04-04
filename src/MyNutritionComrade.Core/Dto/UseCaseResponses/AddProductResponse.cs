using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Dto.UseCaseResponses
{
    public class AddProductResponse
    {
        public AddProductResponse(Product product)
        {
            Product = product;
        }

        public Product Product { get; }
    }
}
