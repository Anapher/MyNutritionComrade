using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using MyNutritionComrade.Models.Paging;
using Raven.Client.Documents;
using Raven.Client.Documents.Linq;

namespace MyNutritionComrade.Extensions
{
    public static class RavenQueryableExtensions
    {
        public static async Task<List<T>> ToPageByDateTimeAsync<T>(this IRavenQueryable<T> query, PagingRequest request,
            Expression<Func<T, DateTimeOffset>> keySelector, SortDirection defaultSort = SortDirection.Ascending)
        {
            var result = await query.PageByDateTime(request, keySelector, defaultSort).ToListAsync();

            // sort the result as specific queries must sort in the opposite direction
            var sortDirection = request.SortDirection ?? defaultSort;
            if (sortDirection == SortDirection.Ascending)
                return result.OrderBy(keySelector.Compile()).ToList();

            return result.OrderByDescending(keySelector.Compile()).ToList();
        }
    }
}
