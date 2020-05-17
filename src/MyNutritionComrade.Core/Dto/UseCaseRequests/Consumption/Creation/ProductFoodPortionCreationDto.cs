using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation
{
    public class ProductFoodPortionCreationDto : FoodPortionCreationDto
    {
        public ProductFoodPortionCreationDto(string productId, double amount, ServingType servingType)
        {
            ProductId = productId;
            Amount = amount;
            ServingType = servingType;
        }

        public string ProductId { get; private set; }
        public double Amount { get; private set; }
        public ServingType ServingType { get; private set; }
    }
}
