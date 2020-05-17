using Microsoft.AspNetCore.Mvc;

namespace MyNutritionComrade.Models.Request
{
    public class SearchProductFilter
    {
        [FromQuery(Name = "units")]
        public string? Units { get; set; }

        [FromQuery(Name = "consumables_filter")]
        public string? ConsumableFilter { get; set; }
    }
}
