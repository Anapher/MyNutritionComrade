using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;
using MyNutritionComrade.Models;

namespace CommunityCatalog.Core.Gateways.Repos
{
    public interface IProductRepository
    {
        ValueTask Add(ProductDocument product);

        ValueTask Update(ProductDocument product);

        ValueTask<ProductDocument?> FindById(string productId);

        ValueTask<ProductDocument?> FindByCode(string code);

        ValueTask<DateTimeOffset?> GetLatestProductChange();

        ValueTask<IReadOnlyList<Product>> GetAll();
    }
}
