using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Models.Response;
using Raven.Client.Documents.Session;

namespace MyNutritionComrade.Selectors
{
    public interface IFoodPortionDtoSelector : IDataSelector
    {
        ValueTask<IReadOnlyDictionary<FoodPortion, FoodPortionDto>> SelectViewModels(IReadOnlyList<FoodPortion> foodPortions);
    }

    public class FoodPortionDtoSelector : IFoodPortionDtoSelector
    {
        private readonly IAsyncDocumentSession _session;
        private readonly IMapper _mapper;

        public FoodPortionDtoSelector(IAsyncDocumentSession session, IMapper mapper)
        {
            _session = session;
            _mapper = mapper;
        }

        public async ValueTask<IReadOnlyDictionary<FoodPortion, FoodPortionDto>> SelectViewModels(IReadOnlyList<FoodPortion> foodPortions)
        {
            var productIds = GetRequiredProducts(foodPortions).ToHashSet();
            var products = productIds.Any() ? await _session.LoadAsync<Product>(productIds) : new Dictionary<string, Product>();

            return foodPortions.ToDictionary(x => x, x => CreateDto(x, products));
        }

        private static IEnumerable<string> GetRequiredProducts(IReadOnlyList<FoodPortion> foodPortions)
        {
            foreach (var foodPortion in foodPortions)
            {
                if (foodPortion is FoodPortionProduct product)
                {
                    yield return product.ProductId;
                    continue;
                }

                if (foodPortion is FoodPortionSuggestion suggestion)
                {
                    foreach (var productId in GetRequiredProducts(suggestion.Items))
                        yield return productId;
                    continue;
                }

                if (foodPortion is FoodPortionMeal meal)
                {
                    foreach (var productId in GetRequiredProducts(meal.Items))
                        yield return productId;
                    continue;
                }
            }
        }

        private FoodPortionDto CreateDto(FoodPortion foodPortion, IReadOnlyDictionary<string, Product> products)
        {
            if (foodPortion is FoodPortionProduct productPortion)
            {
                var product = products[productPortion.ProductId];
                var productDto = _mapper.Map<ProductDto>(product);

                return new FoodPortionProductDto
                {
                    Product = productDto,
                    Amount = productPortion.Amount,
                    ServingType = productPortion.ServingType,
                    NutritionalInfo = foodPortion.NutritionalInfo
                };
            }

            if (foodPortion is FoodPortionSuggestion suggestion)
            {
                return new FoodPortionSuggestedDto
                {
                    SuggestionId = suggestion.SuggestionId,
                    NutritionalInfo = suggestion.NutritionalInfo,
                    Items = suggestion.Items.Select(x => CreateDto(x, products)).ToList()
                };
            }

            if (foodPortion is FoodPortionMeal meal)
            {
                return new FoodPortionMealDto
                {
                    NutritionalInfo = meal.NutritionalInfo,
                    MealId = meal.MealId,
                    MealName = meal.MealName,
                    Portion = meal.Portion,
                    Items = meal.Items.Select(x => CreateDto(x, products)).Cast<FoodPortionItemDto>().ToList()
                };
            }

            if (foodPortion is FoodPortionCustom custom)
            {
                return new FoodPortionCustomDto {Label = custom.Label, NutritionalInfo = custom.NutritionalInfo};
            }

            throw new ArgumentException();
        }
    }
}
