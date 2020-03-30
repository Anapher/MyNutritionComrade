using System.Collections.Immutable;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyNutritionComrade.Core.Domain.Entities;
using Newtonsoft.Json;

namespace MyNutritionComrade.Infrastructure.Data.Configurations
{
    internal class ConsumedProductConfiguration : IEntityTypeConfiguration<ConsumedProduct>
    {
        public void Configure(EntityTypeBuilder<ConsumedProduct> builder)
        {
            builder.OwnsOne(x => x.NutritionInformation);
            builder.HasKey(x => new {x.UserId, x.Date, x.Time, x.ProductId});
            builder.Property(x => x.Tags).HasConversion(x => JsonConvert.SerializeObject(x), x => JsonConvert.DeserializeObject<ImmutableHashSet<string>>(x));
        }
    }
}
