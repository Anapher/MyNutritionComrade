using System;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Specifications
{
    public class SearchMealByNameSpecification : BaseSpecification<Meal>
    {
        public SearchMealByNameSpecification(string name) : base(x => x.Name.Contains(name, StringComparison.OrdinalIgnoreCase))
        {
        }
    }
}
