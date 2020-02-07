using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.Services;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly IProductsCollection _productsCollection;

        public ProductRepository(IProductsCollection productsCollection)
        {
            _productsCollection = productsCollection;
        }

        public Task<IList<IProduct>> QueryProducts(string searchString, int limit)
        {
            _productsCollection.Products.FindAsync(new JsonFilterDefinition<Product>(""))
        }
    }
}
