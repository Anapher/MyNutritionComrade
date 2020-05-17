using System.Linq;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using Raven.Client.Documents.Indexes;

namespace MyNutritionComrade.Infrastructure.Data.Indexes
{
    public class Consumed_ByDate : AbstractIndexCreationTask<Consumed>
    {
        public Consumed_ByDate()
        {
            Map = allConsumed => from consumed in allConsumed select new {consumed.UserId, consumed.Date, consumed.Time, consumed.FoodPortionId};
        }
    }
}
