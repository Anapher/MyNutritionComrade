using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Infrastructure.Data.Configurations
{
    public class ProductLabelConfiguration : IEntityTypeConfiguration<ProductLabel>
    {
        public void Configure(EntityTypeBuilder<ProductLabel> builder)
        {
            builder.HasIndex(x => x.NormalizedName);
        }
    }
}
