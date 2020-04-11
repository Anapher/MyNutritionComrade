using System;
using Microsoft.AspNetCore.Mvc;

namespace MyNutritionComrade.Models.Paging
{
    public class PagingRequest
    {
        [FromQuery(Name = "page[size]")]
        public int PageSize { get; set; } = 30;

        [FromQuery(Name = "page[after]")]
        public DateTimeOffset? PageAfter { get; set; }

        [FromQuery(Name = "page[before]")]
        public DateTimeOffset? PageBefore { get; set; }

        [FromQuery(Name = "sort-dir")]
        public SortDirection? SortDirection { get; set; }
    }

    public enum SortDirection
    {
        Ascending,
        Descending
    }
}
