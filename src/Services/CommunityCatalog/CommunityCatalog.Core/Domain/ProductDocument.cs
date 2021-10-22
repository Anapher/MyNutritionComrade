using System;
using MyNutritionComrade.Models;

namespace CommunityCatalog.Core.Domain
{
    public record ProductDocument(Product Product, int Version, DateTimeOffset CreatedOn, ProductMirrorInfo? MirrorInfo,
        int ConcurrencyToken = 0);
}
