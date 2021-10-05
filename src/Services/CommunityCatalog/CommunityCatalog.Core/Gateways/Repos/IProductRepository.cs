using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;
using MyNutritionComrade.Models;

namespace CommunityCatalog.Core.Gateways.Repos
{
    public interface IProductRepository
    {
        ValueTask Add(VersionedProduct product);

        ValueTask<VersionedProduct?> FindById(string productId);

        ValueTask<DateTimeOffset?> GetLatestProductChange();

        ValueTask<IReadOnlyList<Product>> GetAll();
    }
}
