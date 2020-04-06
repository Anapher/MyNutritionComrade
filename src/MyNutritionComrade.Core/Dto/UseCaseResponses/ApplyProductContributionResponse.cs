using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Dto.UseCaseResponses
{
    public class ApplyProductContributionResponse
    {
        public ApplyProductContributionResponse(ProductContribution productContribution, Product product)
        {
            ProductContribution = productContribution;
            Product = product;
        }

        public ProductContribution ProductContribution { get; }
        public Product Product { get; }
    }
}
