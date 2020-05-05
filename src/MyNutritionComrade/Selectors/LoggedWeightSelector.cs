using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Extensions;
using MyNutritionComrade.Infrastructure.Data.Indexes;
using MyNutritionComrade.Models.Paging;
using Raven.Client.Documents;
using Raven.Client.Documents.Linq;
using Raven.Client.Documents.Session;

namespace MyNutritionComrade.Selectors
{
    public interface ILoggedWeightSelector : IDataSelector
    {
        Task<PagingInternalResponse<LoggedWeight>> GetLoggedWeight(string userId, PagingRequest request);
    }

    public class LoggedWeightSelector : ILoggedWeightSelector
    {
        private readonly IAsyncDocumentSession _session;

        public LoggedWeightSelector(IAsyncDocumentSession session)
        {
            _session = session;
        }

        public async Task<PagingInternalResponse<LoggedWeight>> GetLoggedWeight(string userId, PagingRequest request)
        {
            var query = _session.Query<LoggedWeight, LoggedWeight_ByTimestamp>().Where(x => x.UserId == userId);

            var count = await query.CountAsync();
            var result = await query.ToPageByDateTimeAsync(request, x => x.Timestamp, SortDirection.Descending);

            var links = PagingExtensions.CreateLinks(result, x => x.Timestamp, SortDirection.Descending);
            return new PagingInternalResponse<LoggedWeight>(links, new PagingMetadata(count), result);
        }
    }
}
