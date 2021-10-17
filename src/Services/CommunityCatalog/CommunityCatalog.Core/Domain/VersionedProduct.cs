using System;
using System.Collections.Generic;
using MyNutritionComrade.Models;

namespace CommunityCatalog.Core.Domain
{
    public record VersionedProduct(int Version, DateTimeOffset CreatedOn, DateTimeOffset ModifiedOn, string Id,
        string? Code, IReadOnlyDictionary<string, ProductLabel> Label, NutritionalInfo NutritionalInfo,
        IReadOnlyDictionary<ServingType, double> Servings, ServingType DefaultServing,
        IReadOnlyDictionary<string, bool>? Tags) : Product(Id, ModifiedOn, Code, Label, NutritionalInfo, Servings,
        DefaultServing, Tags);
}
