using MyNutritionComrade.Core.Domain;

namespace MyNutritionComrade.Models.Response
{
    public class ProductDto : ProductInfo
    {
        public string Id { get; set; } = string.Empty;
        public int Version { get; set; }
    }
}
