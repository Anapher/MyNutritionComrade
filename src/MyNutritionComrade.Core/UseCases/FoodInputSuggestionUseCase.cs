using System;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Core.Specifications;

namespace MyNutritionComrade.Core.UseCases
{
    public class FoodInputSuggestionUseCase : UseCaseStatus<FoodInputSuggestionResponse>, IFoodInputSuggestionUseCase
    {
        private readonly IMealRepository _mealRepository;
        private readonly IInputParser _inputParser;
        private readonly IProductRepository _productRepository;

        public FoodInputSuggestionUseCase(IMealRepository mealRepository, IInputParser inputParser, IProductRepository productRepository)
        {
            _mealRepository = mealRepository;
            _inputParser = inputParser;
            _productRepository = productRepository;
        }

        public Task<FoodInputSuggestionResponse?> Handle(FoodInputSuggestionRequest message)
        {
            // Order:
            // 1. Meals
            // 2. Alias
            // 3. Search

            var mealsTask = _mealRepository.GetLimitedBySpecs(3, new SearchMealByNameSpecification(message.Input));

            var s = message.Input.AsSpan();
            _inputParser.TryParseServingSize(ref s, out var servingSize);

            var products = _productRepository.QueryProducts(s.ToString(), 10);
            throw new NotImplementedException();
        }
    }
}
