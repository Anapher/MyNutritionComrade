using System;
using System.Collections;
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
using Newtonsoft.Json.Linq;
using Xunit;

namespace MyNutritionComrade.IntegrationTests.Controllers
{
    public class ConsumptionControllerTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly CustomWebApplicationFactory _factory;

        public ConsumptionControllerTests(CustomWebApplicationFactory factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task TestConsumptionNoEntries()
        {
            var client = _factory.CreateClient();
            await AuthControllerIntegrationTests.Authenticate(client);

            var httpResponse = await client.GetAsync("/api/v1/consumption/2020-03-20");
            Assert.Equal(HttpStatusCode.OK, httpResponse.StatusCode);
            var response = await httpResponse.Content.ReadAsStringAsync();
            Assert.Equal("[]", response);
        }

        [Fact]
        public async Task TestConsumptionReturnEntries()
        {
            var sp = _factory.Services;
            using (var scope = sp.CreateScope())
            {
                var nutritionInfo = new NutritionalInfo(100, 240, 0, 0, 60, 0, 20, 0, 0);

                var scopedServices = scope.ServiceProvider;
                var appDb = scopedServices.GetRequiredService<AppDbContext>();
                appDb.Set<ConsumedProduct>().Add(new ConsumedProduct("41532945-599e-4910-9599-0e7402017fbe", new DateTime(2020, 2, 22),
                    ConsumptionTime.Breakfast, "1", nutritionInfo.ChangeVolume(50), ImmutableHashSet<string>.Empty));
                appDb.Set<ConsumedProduct>().Add(new ConsumedProduct("41532945-599e-4910-9599-0e7402017fbf", new DateTime(2020, 2, 22), ConsumptionTime.Lunch,
                    "1", nutritionInfo.ChangeVolume(70), ImmutableHashSet<string>.Empty));
                appDb.Set<ConsumedProduct>().Add(new ConsumedProduct("41532945-599e-4910-9599-0e7402017fbe", new DateTime(2020, 2, 21),
                    ConsumptionTime.Breakfast, "1", nutritionInfo.ChangeVolume(200), ImmutableHashSet<string>.Empty));

                appDb.SaveChanges();

                var product = new Product("1", 1);
                product.AddProductLabel("Haferflocken", "de");

                var mockRepo = sp.GetRequiredService<MockProductRepository>();
                mockRepo.EnsureProductExists(product);
            }

            var client = _factory.CreateClient();

            await AuthControllerIntegrationTests.Authenticate(client);

            var httpResponse = await client.GetAsync("/api/v1/consumption/2020-02-22");
            Assert.Equal(HttpStatusCode.OK, httpResponse.StatusCode);
            var stringResponse = await httpResponse.Content.ReadAsStringAsync();

            dynamic result = JArray.Parse(stringResponse);
            dynamic o = Assert.Single((IEnumerable) result);

            Assert.Equal("Breakfast", (string) o.time);
        }

        [Fact]
        public async Task TestConsumptionCreateEntry()
        {
            var sp = _factory.Services;
            using (var scope = sp.CreateScope())
            {
                var nutritionInfo = new NutritionalInfo(100, 240, 0, 0, 60, 0, 20, 0, 0);

                var product = new Product("1", 1) {NutritionalInfo = nutritionInfo};
                product.AddProductLabel("Haferflocken", "de");

                var mockRepo = scope.ServiceProvider.GetRequiredService<MockProductRepository>();
                mockRepo.EnsureProductExists(product);
            }

            var client = _factory.CreateClient();

            await AuthControllerIntegrationTests.Authenticate(client);

            var httpResponse = await client.GetAsync("/api/v1/consumption/2020-04-22");
            Assert.Equal(HttpStatusCode.OK, httpResponse.StatusCode);

            var stringResponse = await httpResponse.Content.ReadAsStringAsync();
            Assert.Equal("[]", stringResponse);

            httpResponse = await client.PutAsync("/api/v1/consumption/2020-04-22/lunch/1", new JsonContent(120));
            Assert.Equal(HttpStatusCode.OK, httpResponse.StatusCode);

            httpResponse = await client.GetAsync("/api/v1/consumption/2020-04-22");
            Assert.Equal(HttpStatusCode.OK, httpResponse.StatusCode);

            stringResponse = await httpResponse.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ConsumedProductDto[]>(stringResponse);
            var consumedProduct = Assert.Single(result);
            Assert.Equal(ConsumptionTime.Lunch, consumedProduct.Time);
            Assert.Equal("1", consumedProduct.ProductId);
            Assert.Equal(120, consumedProduct.NutritionalInfo.Volume);
        }

        [Fact]
        public async Task TestConsumptionUpdateEntry()
        {
            var sp = _factory.Services;
            using (var scope = sp.CreateScope())
            {
                var nutritionInfo = new NutritionalInfo(100, 240, 0, 0, 60, 0, 20, 0, 0);

                var product = new Product("1", 1) { NutritionalInfo = nutritionInfo };
                product.AddProductLabel("Haferflocken", "de");

                var mockRepo = scope.ServiceProvider.GetRequiredService<MockProductRepository>();
                mockRepo.EnsureProductExists(product);
            }

            var client = _factory.CreateClient();

            await AuthControllerIntegrationTests.Authenticate(client);

            // create product and verify that it is created correctly
            var httpResponse = await client.PutAsync("/api/v1/consumption/2020-05-01/dinner/1", new JsonContent(400));
            Assert.Equal(HttpStatusCode.OK, httpResponse.StatusCode);

            httpResponse = await client.GetAsync("/api/v1/consumption/2020-05-01");
            Assert.Equal(HttpStatusCode.OK, httpResponse.StatusCode);

            var stringResponse = await httpResponse.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ConsumedProductDto[]>(stringResponse);
            var consumedProduct = Assert.Single(result);
            Assert.Equal(400, consumedProduct.NutritionalInfo.Volume);

            // update product
            httpResponse = await client.PutAsync("/api/v1/consumption/2020-05-01/dinner/1", new JsonContent(600));
            Assert.Equal(HttpStatusCode.OK, httpResponse.StatusCode);

            httpResponse = await client.GetAsync("/api/v1/consumption/2020-05-01");
            Assert.Equal(HttpStatusCode.OK, httpResponse.StatusCode);

            stringResponse = await httpResponse.Content.ReadAsStringAsync();
            result = JsonConvert.DeserializeObject<ConsumedProductDto[]>(stringResponse);
            consumedProduct = Assert.Single(result);
            Assert.Equal(600, consumedProduct.NutritionalInfo.Volume);
        }

        [Fact]
        public async Task TestConsumptionDeleteEntry()
        {
            var sp = _factory.Services;
            using (var scope = sp.CreateScope())
            {
                var nutritionInfo = new NutritionalInfo(100, 240, 0, 0, 60, 0, 20, 0, 0);

                var product = new Product("1", 1) { NutritionalInfo = nutritionInfo };
                product.AddProductLabel("Haferflocken", "de");

                var mockRepo = scope.ServiceProvider.GetRequiredService<MockProductRepository>();
                mockRepo.EnsureProductExists(product);
            }

            var client = _factory.CreateClient();

            await AuthControllerIntegrationTests.Authenticate(client);

            // create product and verify that it is created correctly
            var httpResponse = await client.PutAsync("/api/v1/consumption/2020-05-02/dinner/1", new JsonContent(400));
            Assert.Equal(HttpStatusCode.OK, httpResponse.StatusCode);

            httpResponse = await client.GetAsync("/api/v1/consumption/2020-05-02");
            Assert.Equal(HttpStatusCode.OK, httpResponse.StatusCode);

            var stringResponse = await httpResponse.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<ConsumedProductDto[]>(stringResponse);
            var consumedProduct = Assert.Single(result);

            // update product
            httpResponse = await client.PutAsync("/api/v1/consumption/2020-05-02/dinner/1", new JsonContent(0));
            Assert.Equal(HttpStatusCode.OK, httpResponse.StatusCode);

            httpResponse = await client.GetAsync("/api/v1/consumption/2020-05-02");
            Assert.Equal(HttpStatusCode.OK, httpResponse.StatusCode);

            stringResponse = await httpResponse.Content.ReadAsStringAsync();
            result = JsonConvert.DeserializeObject<ConsumedProductDto[]>(stringResponse);
            Assert.Empty(result);
        }
    }
}
