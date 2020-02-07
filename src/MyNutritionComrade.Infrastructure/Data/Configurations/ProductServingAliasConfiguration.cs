using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Infrastructure.Data.Configurations
{
    internal class ProductServingAliasConfiguration : IEntityTypeConfiguration<ProductServingAlias>
    {
        public void Configure(EntityTypeBuilder<ProductServingAlias> builder)
        {
            builder.HasIndex(x => x.NormalizedName);
        }
    }
}
