using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Data.CompareExchange;
using MyNutritionComrade.Infrastructure.Data.Indexes;
using MyNutritionComrade.Infrastructure.Shared;
using Raven.Client.Documents;
using Raven.Client.Documents.Operations.CompareExchange;
using Raven.Client.Exceptions;

#pragma warning disable CS8619 // Nullability of reference types in value doesn't match target type.

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class ProductRepository : RavenRepo, IProductRepository
    {
        private const string CollectionName = "product";

        public ProductRepository(IDocumentStore store) : base(store)
        {
        }

        public Task<Product?> FindById(string productId)
        {
            using var session = OpenReadOnlySession();
            return session.LoadAsync<Product>($"{CollectionName}/{productId}");
        }

        public Task<Product?> FindByBarcode(string code)
        {
            using var session = OpenReadOnlySession();
            return session.Query<Product_ByCode.Result, Product_ByCode>().Where(x => x.Code == code).OfType<Product>().FirstOrDefaultAsync();
        }

        public async Task<bool> Add(Product product, ProductContribution contribution)
        {
            using var session = OpenWriteClusterSession();

            if (!string.IsNullOrEmpty(product.Code))
                ProductCompareExchange.CreateProductCode(session, product);

            ProductCompareExchange.CreateProductVersion(session, product);

            SetGuidId(contribution);

            await session.StoreAsync(product);
            await session.StoreAsync(contribution);

            try
            {
                await session.SaveChangesAsync();
                return true;
            }
            catch (ConcurrencyException)
            {
                // code already assigned to a different product
                return false;
            }
        }

        public async Task<bool> SaveProductChanges(Product product, int sourceVersion, ProductContribution productContribution)
        {
            if (productContribution.Status != ProductContributionStatus.Applied)
                throw new ArgumentException("The product contribution must have the status applied.");

            if (productContribution.AppliedVersion != product.Version)
                throw new ArgumentException("The product contribution must have the same applied version as the product.");

            // find current product
            var currentProduct = await FindById(product.Id);
            if (currentProduct == null)
                throw new ArgumentException("The product does not exist.");

            // if the version mismatches with the stored values
            if (currentProduct.Version != sourceVersion) return false;
            if (currentProduct.Version >= product.Version)
                throw new ArgumentException("The product version must be incremented.");

            using var session = OpenWriteClusterSession();

            // get version unique value
            var productVersion = await ProductCompareExchange.GetProductVersion(session, currentProduct);
            if (productVersion.Value != product.Version) return false;

            // update version
            session.Advanced.ClusterTransaction.UpdateCompareExchangeValue(new CompareExchangeValue<int>(productVersion.Key, productVersion.Index,
                product.Version));

            // update product
            await session.StoreAsync(product);

            // update product code
            if (product.Code != currentProduct.Code)
            {
                if (currentProduct.Code != null)
                {
                    var currentProductCode = await ProductCompareExchange.GetProductCode(session, currentProduct);
                    if (currentProductCode.Value != currentProduct.Id)
                        throw new InvalidOperationException("The code compare exchange value does not match the current product.");

                    session.Advanced.ClusterTransaction.DeleteCompareExchangeValue(currentProductCode.Key, currentProductCode.Index);
                }

                if (product.Code != null) ProductCompareExchange.CreateProductCode(session, product);
            }

            // update product contribution
            var contributionPatchHash =
                await ProductContributionCompareExchange.GetPatchHash(session, productContribution.ProductId, productContribution.PatchHash);
            if (contributionPatchHash != null)
                session.Advanced.ClusterTransaction.DeleteCompareExchangeValue(contributionPatchHash.Key, contributionPatchHash.Index);

            await session.StoreAsync(productContribution);

            try
            {
                await session.SaveChangesAsync();
                return true;
            }
            catch (ConcurrencyException)
            {
                return false;
            }
        }

        public async Task<ICollection<Product>> FindByIds(IEnumerable<string> ids)
        {
            using var session = OpenReadOnlySession();

            var result = await session.LoadAsync<Product>(ids);
            return result.Values;
        }
    }
}
