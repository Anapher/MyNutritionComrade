using System.Collections.Generic;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class PatchProductRequest : IUseCaseRequest<PatchProductResponse>
    {
        public PatchProductRequest(string productId, IReadOnlyList<PatchOperation> patchOperations, string userId)
        {
            ProductId = productId;
            PatchOperations = patchOperations;
            UserId = userId;
        }

        public string ProductId { get; }
        public IReadOnlyList<PatchOperation> PatchOperations { get; }
        public string UserId { get; }
    }
}
