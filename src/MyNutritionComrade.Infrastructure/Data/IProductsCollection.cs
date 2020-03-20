using MongoDB.Driver;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Infrastructure.Data
{
    public interface IProductsCollection
    {
        IMongoCollection<Product> Products { get; }
        IMongoCollection<ProductContribution> ProductContributions { get; }
    }
}