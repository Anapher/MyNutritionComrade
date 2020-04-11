namespace MyNutritionComrade.Models.Paging
{
    public class PagingMetadata
    {
        public PagingMetadata(int totalRecords)
        {
            TotalRecords = totalRecords;
        }

        public int TotalRecords { get; set; }
    }
}