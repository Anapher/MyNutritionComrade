using System.Linq;
using MyNutritionComrade.Core.Domain.Entities;
using Raven.Client.Documents.Indexes;

namespace MyNutritionComrade.Infrastructure.Data.Indexes
{
    public class ProductContribution_ByProductAndStatus : AbstractIndexCreationTask<ProductContribution>
    {
        public ProductContribution_ByProductAndStatus()
        {
            Map = contributions => contributions.Select(x => new {x.ProductId, x.Status});
        }
    }
}
