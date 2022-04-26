using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Extractor.Interface;
using MyNutritionComrade.Models;

namespace Extractors.McDonalds
{
    public class McDonaldsExtractor : IExtractor
    {
        public async Task RunAsync(HttpClient client, IProductWriter writer, ILogger logger)
        {
            var categories = await Api.GetCategoryUrls(client);
            var products = new Dictionary<int, Product>();

            foreach (var categoryUrl in categories)
            {
                var productUrls = await Api.GetProductUrls(client, categoryUrl);
                foreach (var productUrl in productUrls)
                {
                    var (name, productId) = await Api.LoadProductInfoFromUrl(client, productUrl);
                    if (products.ContainsKey(productId)) continue;

                    var product = await Api.LoadProduct(client, name, productId);
                    products.Add(productId, product);
                }
            }

            foreach (var product in ProductPostProcessor.Execute(products.Values))
            {
                await writer.Write(product);
            }
        }
    }
}
