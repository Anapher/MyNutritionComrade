using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Models.Response;

namespace MyNutritionComrade.Selectors
{
    public interface IConsumedDtoSelector : IDataSelector
    {
        ValueTask<IReadOnlyList<ConsumedDto>> SelectConsumedDtos(IReadOnlyList<Consumed> consumed);
    }

    public class ConsumedDtoSelector : IConsumedDtoSelector
    {
        private readonly IFoodPortionDtoSelector _foodPortionDtoSelector;

        public ConsumedDtoSelector(IFoodPortionDtoSelector foodPortionDtoSelector)
        {
            _foodPortionDtoSelector = foodPortionDtoSelector;
        }

        public async ValueTask<IReadOnlyList<ConsumedDto>> SelectConsumedDtos(IReadOnlyList<Consumed> consumed)
        {
            var foodPortions = consumed.Select(x => x.FoodPortion).ToList();
            var foodPortionDtos = await _foodPortionDtoSelector.SelectViewModels(foodPortions);

            return consumed.Select(x => new ConsumedDto {Date = x.Date, Time = x.Time, FoodPortion = foodPortionDtos[x.FoodPortion]}).ToList();
        }
    }
}
