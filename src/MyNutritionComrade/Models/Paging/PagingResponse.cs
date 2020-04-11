using System.Collections.Generic;

namespace MyNutritionComrade.Models.Paging
{
    public class PagingResponse<T>
    {
        public PagingResponse(PagingLinks links, PagingMetadata meta, List<T> data)
        {
            Links = links;
            Meta = meta;
            Data = data;
        }

        public PagingLinks Links { get; set; }
        public PagingMetadata Meta { get; set; }
        public List<T> Data { get; set; }
    }
}
