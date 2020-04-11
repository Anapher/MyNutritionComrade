using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using MyNutritionComrade.Infrastructure.Extensions;
using MyNutritionComrade.Models.Paging;

namespace MyNutritionComrade.Extensions
{
    public static class PagingExtensions
    {
        public static IQueryable<T> SortBy<T, TK>(this IQueryable<T> query, Expression<Func<T, TK>> keySelector, SortDirection direction)
        {
            switch (direction)
            {
                case SortDirection.Ascending:
                    return query.OrderBy(keySelector);
                case SortDirection.Descending:
                    return query.OrderByDescending(keySelector);
                default:
                    throw new ArgumentOutOfRangeException(nameof(direction), direction, null);
            }
        }

        public static IQueryable<T> PageByDateTime<T>(this IQueryable<T> query, PagingRequest request,
            Expression<Func<T, DateTimeOffset>> keySelector, SortDirection defaultSort = SortDirection.Ascending)
        {
            var sortDirection = request.SortDirection ?? defaultSort;
            switch (sortDirection)
            {
                // Ascending: PageBefore | Current Page | PageAfter
                case SortDirection.Ascending:
                    // x.CreatedOn < PageBefore
                    if (request.PageBefore != null)
                    {
                        var exp = Expression.LessThan(keySelector.Body, Expression.Constant(request.PageBefore));
                        var lambda = Expression.Lambda<Func<T, bool>>(exp, keySelector.Parameters);

                        // invert sort so we get the closest elements to the cursor
                        query = query.SortBy(keySelector, SortDirection.Descending).Where(lambda);
                    }
                    else
                    {
                        // else sort ascending
                        query = query.SortBy(keySelector, sortDirection);
                    }

                    // // x.CreatedOn > PageAfter
                    if (request.PageAfter != null)
                    {
                        var exp = Expression.GreaterThan(keySelector.Body, Expression.Constant(request.PageAfter));
                        var lambda = Expression.Lambda<Func<T, bool>>(exp, keySelector.Parameters);

                        query = query.Where(lambda);
                    }
                    break;
                case SortDirection.Descending:
                    // x.CreatedOn > PageBefore
                    if (request.PageBefore != null)
                    {
                        var exp = Expression.GreaterThan(keySelector.Body, Expression.Constant(request.PageBefore));
                        var lambda = Expression.Lambda<Func<T, bool>>(exp, keySelector.Parameters);

                        // invert sort so we get the closest elements to the cursor
                        query = query.SortBy(keySelector, SortDirection.Ascending).Where(lambda);
                    }
                    else
                    {
                        // else sort ascending
                        query = query.SortBy(keySelector, sortDirection);
                    }

                    // // x.CreatedOn < PageAfter
                    if (request.PageAfter != null)
                    {
                        var exp = Expression.LessThan(keySelector.Body, Expression.Constant(request.PageAfter));
                        var lambda = Expression.Lambda<Func<T, bool>>(exp, keySelector.Parameters);

                        query = query.Where(lambda);
                    }
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            if (request.PageBefore == null || request.PageAfter == null)
                query = query.Take(request.PageSize);

            return query;
        }

        public static PagingInternalLinks CreateLinks<T>(IEnumerable<T> result, Func<T, DateTimeOffset> dateSelector,
            SortDirection direction)
        {
            if (result.Any())
                return new PagingInternalLinks(new PagingRequest { PageBefore = dateSelector(result.First()), SortDirection = direction },
                    new PagingRequest { PageAfter = dateSelector(result.Last()), SortDirection = direction });

            if (direction == SortDirection.Ascending)
            {
                return new PagingInternalLinks(new PagingRequest { PageBefore = DateTimeOffset.MaxValue, SortDirection = direction }, null);
            }

            return new PagingInternalLinks(new PagingRequest { PageBefore = DateTimeOffset.MinValue, SortDirection = direction }, null);
        }

        public static PagingResponse<T> MapToController<T>(this PagingInternalResponse<T> response, Controller controller, string action, object routeData)
        {
            var url = controller.Url.ActionLink(action, null, routeData, controller.Request.Scheme, controller.Request.Host.ToString());

            var nextUrl = response.Links.Next != null ? BuildUrl(url, response.Links.Next) : null;
            var previousUrl = response.Links.Previous != null ? BuildUrl(url, response.Links.Previous) : null;

            return new PagingResponse<T>(new PagingLinks(previousUrl, nextUrl), response.Meta, response.Data);
        }

        private static string BuildUrl(string baseUrl, object routeData)
        {
            var uriBuilder = new UriBuilder(new Uri(baseUrl, UriKind.Absolute));

            var query = HttpUtility.ParseQueryString(uriBuilder.Query);

            foreach (var propertyInfo in routeData.GetType().GetProperties())
            {
                var name = propertyInfo.GetCustomAttribute<FromQueryAttribute>()?.Name ?? propertyInfo.Name.ToCamelCase();

                var value = propertyInfo.GetValue(routeData);
                if (value != null)
                    query.Add(name, value.ToString());
            }

            uriBuilder.Query = query.ToString();

            return uriBuilder.Uri.AbsoluteUri;
        }
    }
}
