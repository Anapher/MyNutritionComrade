using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Infrastructure.Data.Configurations
{
    internal class MealProductConfiguration
    {
        public void Configure(EntityTypeBuilder<MealProduct> builder)
        {
            builder.HasIndex(x => new {x.MealId, x.ProductServingId}).IsUnique();
        }
    }
}
