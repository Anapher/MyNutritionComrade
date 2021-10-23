using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using CommunityCatalog.Infrastructure.Mirrors;
using CommunityCatalog.IntegrationTests._Helpers;
using CommunityCatalog.Options;
using CommunityCatalog.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Moq;
using MyNutritionComrade.Models;
using MyNutritionComrade.Models.Index;
using Xunit;
using Xunit.Abstractions;

namespace CommunityCatalog.IntegrationTests.Services
{
    [Collection(IntegrationTestCollection.Definition)]
    public class MirrorSynchronizationTests
    {
        private readonly MirrorInterceptingWebApplicationFactory _factory;
        private readonly Lazy<HttpClient> _clientLazy;

        public MirrorSynchronizationTests(ITestOutputHelper testOutputHelper, MongoDbFixture mongoDb)
        {
            _factory = new MirrorInterceptingWebApplicationFactory(mongoDb, testOutputHelper);
            _clientLazy = new Lazy<HttpClient>(() => _factory.CreateClient());
        }

        private void AddIndex(string indexUrl, Dictionary<string, CatalogData> catalogs)
        {
            _factory.Options.Indexes = _factory.Options.Indexes.Concat(new List<ProductIndexMirror>
            {
                new(indexUrl, catalogs.Where(x => x.Value.Writeable).Select(x => x.Key).ToList()),
            }).ToList();

            _factory.MirrorClientMock.Setup(x => x.FetchCatalogsFromIndex(indexUrl))
                .ReturnsAsync(catalogs.Select(x => new ProductCatalogReference(x.Key, x.Value.ModifiedOn)).ToList());

            foreach (var (catalogUrl, catalogData) in catalogs)
            {
                _factory.MirrorClientMock.Setup(x => x.FetchProductsFromCatalog(catalogUrl))
                    .ReturnsAsync(catalogData.Products);
            }
        }

        [Fact]
        public async Task SynchronizeMirror_EmptyProductList_AddProducts()
        {
            // arrange
            var modifiedDate = new DateTimeOffset(2021, 7, 1, 0, 0, 0, 0, TimeSpan.Zero);
            var mirrorProduct = Product.FromProperties(TestValues.TestProduct, "testId", modifiedDate);

            AddIndex("http://test",
                new Dictionary<string, CatalogData>
                {
                    { "http://test/main", new CatalogData(new List<Product> { mirrorProduct }) },
                });

            // assert
            await AssertHelper.WaitForAssertAsync(async () =>
            {
                var products = await Api.GetAllProducts(_clientLazy.Value);
                var product = Assert.Single(products);
                AssertHelper.AssertObjectsEqualJson(product, mirrorProduct with { ModifiedOn = product.ModifiedOn });
            });
        }

        private record CatalogData(IReadOnlyList<Product> Products, bool Writeable = true)
        {
            public DateTimeOffset ModifiedOn =>
                Products.Count == 0 ? DateTimeOffset.MinValue : Products.Min(x => x.ModifiedOn);
        }
    }

    public class MirrorInterceptingWebApplicationFactory : CustomWebApplicationFactory
    {
        public Mock<IMirrorClient> MirrorClientMock { get; } = new();
        public MirrorOptions Options { get; } = new();

        public MirrorInterceptingWebApplicationFactory(MongoDbFixture mongoDb, ITestOutputHelper testOutputHelper) :
            base(mongoDb, testOutputHelper)
        {
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            base.ConfigureWebHost(builder);

            builder.ConfigureServices(services =>
            {
                services.AddSingleton<IOptions<MirrorOptions>>(new OptionsWrapper<MirrorOptions>(Options));
                services.AddSingleton(MirrorClientMock.Object);
            });
        }
    }
}
