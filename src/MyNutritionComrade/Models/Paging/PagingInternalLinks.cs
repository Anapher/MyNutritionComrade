namespace MyNutritionComrade.Models.Paging
{
    public class PagingInternalLinks
    {
        public PagingInternalLinks(PagingRequest? previous, PagingRequest? next)
        {
            Previous = previous;
            Next = next;
        }

        public PagingRequest? Previous { get; set; }
        public PagingRequest? Next { get; set; }
    }
}