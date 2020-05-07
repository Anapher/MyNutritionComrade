using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Identity;
using MyNutritionComrade.IntegrationTests.Utils;

namespace MyNutritionComrade.IntegrationTests
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Startup>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                // Create a new service provider.
                var serviceProvider = new ServiceCollection()
                    .AddEntityFrameworkInMemoryDatabase()
                    .BuildServiceProvider();

                services.AddDbContext<AppIdentityDbContext>(options =>
                {
                    options.UseInMemoryDatabase("InMemoryIdentityDb");
                    options.UseInternalServiceProvider(serviceProvider);
                });

                var repo = new MockProductRepository();
                services.AddSingleton<IProductRepository>(repo);
                services.AddSingleton(repo);


                // Build the service provider.
                var sp = services.BuildServiceProvider();

                // Create a scope to obtain a reference to the database contexts
                using (var scope = sp.CreateScope())
                {
                    var scopedServices = scope.ServiceProvider;
                    var identityDb = scopedServices.GetRequiredService<AppIdentityDbContext>();

                    var logger = scopedServices.GetRequiredService<ILogger<CustomWebApplicationFactory>>();

                    // Ensure the database is created.
                    identityDb.Database.EnsureCreated();

                    try
                    {
                        // Seed the database with test data.
                        SeedData.PopulateTestData(identityDb);
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "An error occurred seeding the " +
                            "database with test messages. Error: {ex.Message}");
                    }
                }
            });
        }
    }
}
