using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Infrastructure.Data.Indexes;
using Raven.Client.Documents;
using Raven.Client.Documents.Linq;
using Raven.Client.Documents.Session;

namespace MyNutritionComrade.Selectors
{
    public interface ISearchProductSelector : IDataSelector
    {
        Task<IEnumerable<Product>> SearchProducts(string term, string[]? units);
    }

    public class SearchProductSelector : ISearchProductSelector
    {
        private readonly IAsyncDocumentSession _session;

        public SearchProductSelector(IAsyncDocumentSession session)
        {
            _session = session;
        }

        public async Task<IEnumerable<Product>> SearchProducts(string term, string[]? units)
        {
            var query = _session.Query<Product_BySearchProps.Result, Product_BySearchProps>();

            if (units?.Length > 0)
                query = query.Where(x => x.Servings.ContainsAny(units));

            return await query.Search(x => x.ProductName, term + "*").OfType<Product>().ToListAsync();
        }
    }
}
