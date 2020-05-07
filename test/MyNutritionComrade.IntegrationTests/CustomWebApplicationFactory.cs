using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Identity;
using MyNutritionComrade.IntegrationTests.Utils;
using Raven.Client.Documents;
using Raven.TestDriver;

namespace MyNutritionComrade.IntegrationTests
{
    public class TestDriver : RavenTestDriver
    {
        public IDocumentStore Create()
        {
            return GetDocumentStore();
        }
    }

    public class CustomWebApplicationFactory : WebApplicationFactory<Startup>
    {
        private readonly TestDriver _testDriver;

        public CustomWebApplicationFactory()
        {
            _testDriver = new TestDriver();
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _testDriver.Dispose();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureTestServices(services =>
            {
                services.AddSingleton(_testDriver.Create());
            });

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
