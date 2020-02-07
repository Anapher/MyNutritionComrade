namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductServingAlias : LocalizedNamedEntry
    {
        public ProductServingAlias(ProductServing productServing)
        {
            ProductServing = productServing;
            ProductServingId = productServing.Id;
        }

        public ProductServing ProductServing { get; private set; }
        public int ProductServingId { get; private set; }
    }
}
