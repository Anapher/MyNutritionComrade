using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Infrastructure.Data.Configurations
{
    internal class MealConfiguration
    {
        public void Configure(EntityTypeBuilder<Meal> builder)
        {
            builder.OwnsOne(x => x.NutritionInformation);
            builder.Property(x => x.Name).IsRequired();
        }
    }
}
