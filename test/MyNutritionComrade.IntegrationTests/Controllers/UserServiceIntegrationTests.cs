using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Globalization;
using System.Net;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Utilities;
using MyNutritionComrade.Infrastructure.Data;
using MyNutritionComrade.IntegrationTests.Utils;
using MyNutritionComrade.Models.Response;
using Newtonsoft.Json;
using Xunit;

namespace MyNutritionComrade.IntegrationTests.Controllers
{
    public class UserServiceIntegrationTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly CustomWebApplicationFactory _factory;

        public UserServiceIntegrationTests(CustomWebApplicationFactory factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task TestGetFrequentlyUsedProductsNoProducts()
        {
            var client = _factory.CreateClient();
            await AuthControllerIntegrationTests.Authenticate(client);

            var httpResponse = await client.GetAsync("/api/v1/userservice/frequently_used_products");
            Assert.Equal(HttpStatusCode.OK, httpResponse.StatusCode);
            var response = await httpResponse.Content.DeserializeJsonObject<Dictionary<ConsumptionTime, ProductDto[]>>();

            Assert.All(response, x => Assert.Empty(x.Value));
        }

        [Fact]
        public async Task TestGetFrequentlyUsedProductsSomeProducts()
        {
            var sp = _factory.Services;
            using (var scope = sp.CreateScope())
            {
                var nutritionInfo = new NutritionalInfo(100, 240, 0, 0, 60, 0, 20, 0, 0);

                var scopedServices = scope.ServiceProvider;
                var appDb = scopedServices.GetRequiredService<AppDbContext>();
                appDb.Set<ConsumedProduct>().Add(new ConsumedProduct("41532945-599e-4910-9599-0e7402017fbe", DateTime.Now.Date.AddDays(-5),
                    ConsumptionTime.Breakfast, "1", nutritionInfo.ChangeMass(50), ImmutableHashSet<string>.Empty));

                appDb.Set<ConsumedProduct>().Add(new ConsumedProduct("41532945-599e-4910-9599-0e7402017fbe", DateTime.Now.Date.AddDays(-6),
                    ConsumptionTime.Breakfast, "1", nutritionInfo.ChangeMass(235), ImmutableHashSet<string>.Empty));

                appDb.Set<ConsumedProduct>().Add(new ConsumedProduct("41532945-599e-4910-9599-0e7402017fbe", DateTime.Now.Date.AddDays(-6),
                    ConsumptionTime.Breakfast, "2", nutritionInfo.ChangeMass(125), ImmutableHashSet<string>.Empty));

                appDb.SaveChanges();

                var product = new Product("1", 1);
                product.AddProductLabel("Haferflocken", "de");

                var product2 = new Product("2", 1);
                product.AddProductLabel("Milch", "de");

                var mockRepo = sp.GetRequiredService<MockProductRepository>();
                mockRepo.EnsureProductExists(product);
                mockRepo.EnsureProductExists(product2);
            }

            var client = _factory.CreateClient();
            await AuthControllerIntegrationTests.Authenticate(client);

            var httpResponse = await client.GetAsync("/api/v1/userservice/frequently_used_products");
            Assert.Equal(HttpStatusCode.OK, httpResponse.StatusCode);
            var response = await httpResponse.Content.DeserializeJsonObject<Dictionary<ConsumptionTime, ProductDto[]>>();

            var breakfast = response[ConsumptionTime.Breakfast];
            Assert.Collection(breakfast, p => Assert.Equal("1", p.Id), p => Assert.Equal("2", p.Id));
        }
    }
}
