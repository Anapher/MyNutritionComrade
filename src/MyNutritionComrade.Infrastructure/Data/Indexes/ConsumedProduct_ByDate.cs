using System.Linq;
using MyNutritionComrade.Core.Domain.Entities;
using Raven.Client.Documents.Indexes;

namespace MyNutritionComrade.Infrastructure.Data.Indexes
{
    public class ConsumedProduct_ByDate : AbstractIndexCreationTask<ConsumedProduct>
    {
        public ConsumedProduct_ByDate()
        {
            Map = consumedProducts => from product in consumedProducts select new {product.UserId, product.Date, product.Time};
        }
    }
}
