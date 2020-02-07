using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Infrastructure.Data.Configurations
{
    internal class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasIndex(x => x.Code).IsUnique();
            builder.OwnsOne(x => x.NutritionInformation);
        }
    }
}
