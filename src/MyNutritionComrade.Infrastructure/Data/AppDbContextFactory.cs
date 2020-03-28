using Microsoft.EntityFrameworkCore;
using MyNutritionComrade.Infrastructure.Shared;

namespace MyNutritionComrade.Infrastructure.Data
{
    public class AppDbContextFactory : DesignTimeDbContextFactoryBase<AppDbContext>
    {
        protected override AppDbContext CreateNewInstance(DbContextOptions<AppDbContext> options) => new AppDbContext(options);
    }
}
