using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Infrastructure.Data.Indexes;
using MyNutritionComrade.Models.Response;
using Newtonsoft.Json;
using Raven.Client.Documents;
using Raven.Client.Documents.Linq;
using Raven.Client.Documents.Session;

namespace MyNutritionComrade.Selectors
{
    public interface ISearchProductSelector : IDataSelector
    {
        Task<List<SearchResult>> SearchProducts(string term, string[]? units, FoodPortionType[]? consumables, string userId);
    }

    public class SearchProductSelector : ISearchProductSelector
    {
        private readonly IAsyncDocumentSession _session;
        private readonly IMapper _mapper;

        public SearchProductSelector(IAsyncDocumentSession session, IMapper mapper)
        {
            _session = session;
            _mapper = mapper;
        }

        public async Task<List<SearchResult>> SearchProducts(string term, string[]? units, FoodPortionType[]? consumables, string userId)
        {
            var result = new List<SearchResult>();

            if (consumables?.Contains(FoodPortionType.Meal) != false)
                result.AddRange(await QueryMeals(term, userId));

            if (consumables?.Contains(FoodPortionType.Product) != false)
                result.AddRange(await QueryProducts(term, units));

            return result;
        }

        private async Task<IEnumerable<ProductSuggestion>> QueryProducts(string term, string[]? units)
        {
            var query = _session.Query<Product_BySearchProps.Result, Product_BySearchProps>();

            if (units?.Length > 0)
                query = query.Where(x => x.Servings.ContainsAny(units));

            var products = await query.Search(x => x.ProductName, term + "*").OfType<Product>().ToListAsync();
            return products.Select(x => new ProductSuggestion(_mapper.Map<ProductDto>(x)));
        }

        private async Task<IEnumerable<MealSuggestion>> QueryMeals(string term, string userId)
        {
            var meals = await _session.Query<Meal, Meal_ByUserId>().Where(x => x.UserId == userId).Search(x => x.Name, term + "*").ToListAsync();

            return meals.Select(x => new MealSuggestion(x.Name, x.Id));
        }
    }

    public abstract class SearchResult
    {
        [JsonProperty]
        public abstract SearchResultType Type { get; }
    }

    public class ProductSuggestion : SearchResult
    {
        public ProductSuggestion(ProductDto product)
        {
            Product = product;
        }

        public ProductDto Product { get; private set; }
        public override SearchResultType Type { get; } = SearchResultType.Product;
    }

    public class MealSuggestion : SearchResult
    {
        public MealSuggestion(string mealName, string mealId)
        {
            MealName = mealName;
            MealId = mealId;
        }

        public string MealName { get; private set; }
        public string MealId { get; private set; }
        public override SearchResultType Type { get; } = SearchResultType.Meal;
    }

    public enum SearchResultType
    {
        Product,
        Meal
    }
}
