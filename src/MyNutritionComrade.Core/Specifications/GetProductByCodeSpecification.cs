using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Specifications
{
    public class GetProductByCodeSpecification : BaseSpecification<Product>
    {
        public GetProductByCodeSpecification(string productCode) : base(x => x.Code == productCode)
        {
        }
    }
}
