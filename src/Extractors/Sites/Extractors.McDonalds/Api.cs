using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using MyNutritionComrade.Models;
using Newtonsoft.Json;

namespace Extractors.McDonalds
{
    internal static class Api
    {
        private const string StartUrl =
            "https://www.mcdonalds.com/de/de-de/produkte/alle-produkte/aktionsprodukte.html";

        private const string RootUrl = "https://www.mcdonalds.com/";

        private const string ApiUrl =
            "https://www.mcdonalds.com/wws/json/getItemDetails.htm?country=de&language=de&showLiveData=true&item={0}";

        /// <summary>
        ///     Retrieve urls of categories from McDonalds. Urls can be used as input for <see cref="GetProductUrls" />
        /// </summary>
        public static async Task<IReadOnlyList<string>> GetCategoryUrls(HttpClient client)
        {
            var siteSource = await client.GetStringAsync(StartUrl);

            return Regex.Matches(siteSource, "<a href=\"/de/de-de/produkte/alle-produkte/(.*?)\"")
                .Select(x => x.Groups[1].Value).Distinct().Select(x => RootUrl + "de/de-de/produkte/alle-produkte/" + x)
                .ToList();
        }

        /// <summary>
        ///     Get the product urls of a category url. Result can be used as input for <see cref="LoadProductInfoFromUrl" />
        /// </summary>
        public static async Task<IReadOnlyList<string>> GetProductUrls(HttpClient client, string categoryUrl)
        {
            var siteSource = await client.GetStringAsync(categoryUrl);
            return Regex.Matches(siteSource, "href=\"/de/de-de/product/(.*?)\"").Select(x => x.Groups[1].Value)
                .Distinct().Select(x => RootUrl + "de/de-de/product/" + x).ToList();
        }

        /// <summary>
        ///     Load basic product information from a product url
        /// </summary>
        /// <param name="client"></param>
        /// <param name="productUrl"></param>
        /// <returns></returns>
        public static async Task<(string name, int productId)> LoadProductInfoFromUrl(HttpClient client,
            string productUrl)
        {
            var siteSource = await client.GetStringAsync(productUrl);

            var productId = ExtractDataItemIdFromSource(siteSource);
            var name = ExtractProductNameFromSource(siteSource);

            return (name, productId);
        }

        public static async Task<Product> LoadProduct(HttpClient client, string name, int productId)
        {
            var apiResponse = await client.GetStringAsync(string.Format(ApiUrl, productId));
            dynamic apiObj = JsonConvert.DeserializeObject(apiResponse)!;

            string id = "mcdonalds_" + apiObj!.item.short_name;

            var nutritionFacts = apiObj.item.nutrient_facts.nutrient as IEnumerable<dynamic>;
            var nutritionFactsDict = nutritionFacts!.ToDictionary(x => (string)x.nutrient_name_id,
                x => new
                {
                    hundred_g_per_product = ParseDoubleSafe(x.hundred_g_per_product),
                    value = ParseDoubleSafe(x.value),
                });

            var nutritionalInfo = new NutritionalInfo(100, nutritionFactsDict["energy_kcal"].hundred_g_per_product,
                nutritionFactsDict["fat"].hundred_g_per_product,
                nutritionFactsDict["saturated_fat"].hundred_g_per_product,
                nutritionFactsDict["carbohydrate"].hundred_g_per_product,
                nutritionFactsDict["sugar"].hundred_g_per_product, nutritionFactsDict["protein"].hundred_g_per_product,
                nutritionFactsDict["fiber"].hundred_g_per_product, nutritionFactsDict["salt"].hundred_g_per_product);


            // fix some mistakes from McDonalds to pass the product validator
            nutritionalInfo = nutritionalInfo with
            {
                Fat = Math.Max(nutritionalInfo.Fat, nutritionalInfo.SaturatedFat),
                Carbohydrates = Math.Max(nutritionalInfo.Carbohydrates, nutritionalInfo.Sugars),
            };

            name = name.Replace("Cappucino", "Cappuccino");

            var servings = new Dictionary<ServingType, double> { { ServingType.Gram, 1 } };
            var defaultServing = ServingType.Gram;

            double primaryServingSize = nutritionFactsDict["primary_serving_size"].value;
            if (primaryServingSize > 0)
            {
                servings.Add(ServingType.Portion, primaryServingSize);
                defaultServing = ServingType.Portion;
            }

            return new Product(id, DateTimeOffset.UtcNow, null,
                new Dictionary<string, ProductLabel> { { "de", new ProductLabel(name) } }, nutritionalInfo, servings,
                defaultServing, null);
        }

        private static string ExtractProductNameFromSource(string productSiteSource)
        {
            return Regex.Match(productSiteSource, "<title>(.+?)</title>").Groups[1].Value.Trim();
        }

        private static int ExtractDataItemIdFromSource(string productSiteSource)
        {
            return int.Parse(Regex.Match(productSiteSource, "data-item-id=\"([0-9]+)\"").Groups[1].Value);
        }

        /// <summary>
        ///     Parse double and allow an empty string
        /// </summary>
        private static double ParseDoubleSafe(dynamic input)
        {
            return (string)input == "" ? 0 : double.Parse((string)input, CultureInfo.InvariantCulture);
        }
    }
}
