using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class ApplyProductContributionRequest : IUseCaseRequest<ApplyProductContributionResponse>
    {
        public ApplyProductContributionRequest(ProductContribution contribution, Product product, string? description = null, bool writeChanges = true)
        {
            Description = description;
            Contribution = contribution;
            Product = product;
            WriteChanges = writeChanges;
        }

        public string? Description { get; }
        public Product Product { get; }
        public ProductContribution Contribution { get; }
        public bool WriteChanges { get; }
    }
}
