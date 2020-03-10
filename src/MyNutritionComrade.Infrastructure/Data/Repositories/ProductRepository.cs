using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Shared;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class ProductRepository : EfRepository<Product>, IProductRepository
    {
        public ProductRepository(AppDbContext appDbContext) : base(appDbContext)
        {
        }

        public Task<Product?> GetFullProductById(int productId)
        {
#pragma warning disable CS8619 // Nullability of reference types in value doesn't match target type.
            return _appDbContext.Set<Product>().Include(x => x.ProductLabel).Include(x => x.ProductServings).Include(x => x.ProductContributions)
                .FirstOrDefaultAsync();
#pragma warning restore CS8619 // Nullability of reference types in value doesn't match target type.
        }
    }
}
