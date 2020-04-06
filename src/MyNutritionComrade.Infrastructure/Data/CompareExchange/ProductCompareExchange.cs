using System;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using Raven.Client.Documents.Operations.CompareExchange;
using Raven.Client.Documents.Session;

namespace MyNutritionComrade.Infrastructure.Data.CompareExchange
{
    public static class ProductCompareExchange
    {
        private const string ProductCodeCompareExchangeName = "product/code";
        private const string ProductVersionCompareExchangeName = "product/version";

        private static string GetProductCodeKey(string productCode) => $"{ProductCodeCompareExchangeName}/{productCode}";
        private static string GetProductVersionKey(string productId) => $"{ProductVersionCompareExchangeName}/{productId}";

        public static void CreateProductCode(IAsyncDocumentSession session, Product product)
        {
            if (product.Code == null) throw new ArgumentException("The product code must not be null.");

            var key = GetProductCodeKey(product.Code);
            session.Advanced.ClusterTransaction.CreateCompareExchangeValue(key, product.Id);
        }

        public static Task<CompareExchangeValue<string>> GetProductCode(IAsyncDocumentSession session, Product product)
        {
            if (product.Code == null) throw new ArgumentException("The product code must not be null.");

            var key = GetProductCodeKey(product.Code);
            return session.Advanced.ClusterTransaction.GetCompareExchangeValueAsync<string>(key);
        }

        public static void CreateProductVersion(IAsyncDocumentSession session, Product product)
        {
            var key = GetProductVersionKey(product.Id);
            session.Advanced.ClusterTransaction.CreateCompareExchangeValue(key, product.Version);
        }

        public static Task<CompareExchangeValue<int>> GetProductVersion(IAsyncDocumentSession session, Product product)
        {
            var productVersionKey = GetProductVersionKey(product.Id);
            return session.Advanced.ClusterTransaction.GetCompareExchangeValueAsync<int>(productVersionKey);
        }
    }
}
