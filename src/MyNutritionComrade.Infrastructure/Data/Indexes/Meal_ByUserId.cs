using System.Linq;
using MyNutritionComrade.Core.Domain.Entities;
using Raven.Client.Documents.Indexes;

namespace MyNutritionComrade.Infrastructure.Data.Indexes
{
    public class Meal_ByUserId : AbstractIndexCreationTask<Meal>
    {
        public Meal_ByUserId()
        {
            Map = meals => from meal in meals select new {meal.UserId};
        }
    }
}
