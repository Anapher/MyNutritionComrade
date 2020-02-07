using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class FoodInputSuggestionRequest : IUseCaseRequest<FoodInputSuggestionResponse>
    {
        public FoodInputSuggestionRequest(string input, int userId)
        {
            Input = input;
            UserId = userId;
        }

        public string Input { get; }
        public int UserId { get; }
    }
}
