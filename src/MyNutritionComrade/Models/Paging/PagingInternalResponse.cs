using System.Collections.Generic;

namespace MyNutritionComrade.Models.Paging
{
    public class PagingInternalResponse<T>
    {
        public PagingInternalResponse(PagingInternalLinks links, PagingMetadata meta, List<T> data)
        {
            Links = links;
            Meta = meta;
            Data = data;
        }

        public PagingInternalLinks Links { get; set; }
        public PagingMetadata Meta { get; set; }
        public List<T> Data { get; set; }
    }
}
