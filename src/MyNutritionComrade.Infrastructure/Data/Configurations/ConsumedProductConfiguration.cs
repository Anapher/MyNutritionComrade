using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Infrastructure.Data.Configurations
{
    internal class ConsumedProductConfiguration : IEntityTypeConfiguration<ConsumedProduct>
    {
        public void Configure(EntityTypeBuilder<ConsumedProduct> builder)
        {
            builder.OwnsOne(x => x.NutritionInformation);
            builder.HasKey(x => new {x.UserId, x.Day, x.Time, x.ProductId});
        }
    }
}
