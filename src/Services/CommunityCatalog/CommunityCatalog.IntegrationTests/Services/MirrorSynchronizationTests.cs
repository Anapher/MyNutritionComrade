using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using CommunityCatalog.Core;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Gateways.Services;
using CommunityCatalog.IntegrationTests._Helpers;
using CommunityCatalog.IntegrationTests.Extensions;
using CommunityCatalog.Options;
using CommunityCatalog.Services;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
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

            _factory.MirrorClientMock.Setup(x => x.FetchCatalogsFromIndex(indexUrl)).ReturnsAsync(() =>
                catalogs.Select(x => new ProductCatalogReference(x.Key, x.Value.ModifiedOn)).ToList());

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
                AssertProductsEqualIgnoreModifiedOn(product, mirrorProduct);
            });
        }

        [Fact]
        public async Task SynchronizeMirror_ProductAddedOnMirror_AddProduct()
        {
            // arrange
            var catalogProducts = await SetupIndexWithSingleProduct();

            // act
            var newProduct = Product.FromProperties(TestValues.TestProduct with { Code = null }, "product2",
                DateTimeOffset.UtcNow);
            catalogProducts.Add(newProduct);

            await SynchronizeProducts();

            // assert
            await AssertHelper.WaitForAssertAsync(async () =>
            {
                var products = await Api.GetAllProducts(_clientLazy.Value);
                Assert.Equal(2, products.Count);

                var actualNewProduct = Assert.Single(products, x => x.Id == newProduct.Id);
                AssertProductsEqualIgnoreModifiedOn(newProduct, actualNewProduct);
            });
        }

        [Fact]
        public async Task SynchronizeMirror_ProductUpdatedOnMirror_UpdateProduct()
        {
            // arrange
            var catalogProducts = await SetupIndexWithSingleProduct();

            // act
            var product = catalogProducts.Single();
            catalogProducts.Clear();

            Assert.NotEqual(30, product.NutritionalInfo.Protein);
            catalogProducts.Add(product with
            {
                NutritionalInfo = product.NutritionalInfo with { Protein = 30 }, ModifiedOn = DateTimeOffset.UtcNow,
            });

            await SynchronizeProducts();

            // assert
            await AssertHelper.WaitForAssertAsync(async () =>
            {
                var products = await Api.GetAllProducts(_clientLazy.Value);
                var actualProduct = Assert.Single(products);

                Assert.Equal(30, actualProduct.NutritionalInfo.Protein);
            });
        }

        [Fact]
        public async Task SynchronizeMirror_ProductUpdatedLocallyAndOnMirror_MergeUpdates()
        {
            // arrange
            var catalogProducts = await SetupIndexWithSingleProduct();

            // act
            var product = catalogProducts.Single();
            Assert.NotEqual(22, product.NutritionalInfo.Carbohydrates);

            var localPatch =
                new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                    JsonConfig.DefaultSerializer.ContractResolver).Add(x => x.NutritionalInfo.Carbohydrates, 22);
            await _factory.LoginAndSetupClient(_clientLazy.Value, true);
            await Api.PatchProduct(_clientLazy.Value, product.Id, localPatch.Operations);

            catalogProducts.Clear();

            Assert.NotEqual(30, product.NutritionalInfo.Protein);
            catalogProducts.Add(product with
            {
                NutritionalInfo = product.NutritionalInfo with { Protein = 30 }, ModifiedOn = DateTimeOffset.UtcNow,
            });

            await SynchronizeProducts();

            // assert
            await AssertHelper.WaitForAssertAsync(async () =>
            {
                var products = await Api.GetAllProducts(_clientLazy.Value);
                var actualProduct = Assert.Single(products);

                Assert.Equal(30, actualProduct.NutritionalInfo.Protein);
                Assert.Equal(22, actualProduct.NutritionalInfo.Carbohydrates);
            });
        }

        private async Task<List<Product>> SetupIndexWithSingleProduct()
        {
            var modifiedDate = new DateTimeOffset(2021, 7, 1, 0, 0, 0, 0, TimeSpan.Zero);
            var mirrorProduct = Product.FromProperties(TestValues.TestProduct, "testId", modifiedDate);

            var catalogProducts = new List<Product> { mirrorProduct };
            AddIndex("http://test",
                new Dictionary<string, CatalogData> { { "http://test/main", new CatalogData(catalogProducts) } });

            await AssertHelper.WaitForAssertAsync(async () =>
            {
                Assert.Single(await Api.GetAllProducts(_clientLazy.Value));
            });

            return catalogProducts;
        }

        private async Task SynchronizeProducts()
        {
            var mediator = _factory.Services.GetRequiredService<IMediator>();
            await mediator.Send(new MirrorSynchronizerRunRequest());
        }

        private static void AssertProductsEqualIgnoreModifiedOn(Product expected, Product actual)
        {
            AssertHelper.AssertObjectsEqualJson(expected, actual with { ModifiedOn = expected.ModifiedOn });
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
