#pragma warning disable 8618

using System.Collections.Generic;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class CreateMealRequest : IUseCaseRequest<CreateMealResponse>
    {
        public CreateMealRequest(CreateMealDto dto, string userId)
        {
            Dto = dto;
            UserId = userId;
        }

        public string UserId { get; }
        public CreateMealDto Dto { get; }
    }

    public class CreateMealDto
    {
        public string Name { get; set; }
        public List<CreateMealProductDto> Products { get; set; }
    }

    public class CreateMealProductDto
    {
        private sealed class ProductIdEqualityComparer : IEqualityComparer<CreateMealProductDto>
        {
            public bool Equals(CreateMealProductDto x, CreateMealProductDto y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.ProductId == y.ProductId;
            }

            public int GetHashCode(CreateMealProductDto obj)
            {
                return obj.ProductId.GetHashCode();
            }
        }

        public static IEqualityComparer<CreateMealProductDto> ProductIdComparer { get; } = new ProductIdEqualityComparer();

        public string ProductId { get; set; }
        public double Amount { get; set; }
        public ServingType ServingType { get; set; }
    }
}
