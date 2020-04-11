using Newtonsoft.Json;

namespace MyNutritionComrade.Models.Paging
{
    public class PagingLinks
    {
        public PagingLinks(string? previous, string? next)
        {
            Previous = previous;
            Next = next;
        }

        [JsonProperty("prev")]
        public string? Previous { get; set; }

        [JsonProperty("next")]
        public string? Next { get; set; }
    }
}