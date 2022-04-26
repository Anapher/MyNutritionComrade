using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using MyNutritionComrade.Models;

namespace Extractors.McDonalds
{
    public static class ProductPostProcessor
    {
        public static IEnumerable<Product> Execute(IEnumerable<Product> products)
        {
            var productGroups = GroupProductsByName(products);

            foreach (var matchedProducts in productGroups.Values)
            {
                foreach (var product in ProcessProductGroup(matchedProducts))
                {
                    yield return PrefixLabelWithMcDonalds(product);
                }
            }
        }

        private static IEnumerable<Product> ProcessProductGroup(
            IReadOnlyList<ProcessedProductInfo<ParsedServingSize>> group)
        {
            if (group.Count == 1)
                return new[] { group.Single().Product };

            if (group.Any(x => x.ParsedServingSize == null))
            {
                return new[] { group.First().Product };
                //throw new Exception(
                //    "Multiple products with same name except a serving, but serving size is null for at least one product");
            }

            if (AllServingSizeHaveType<ParsedAmountServing>(group, out var amountProducts))
            {
                return ProcessParsedAmountServing(amountProducts);
            }

            if (AllServingSizeHaveType<ParsedSizeMatch>(group, out var sizeProducts))
            {
                return ProcessParsedSizeMatch(sizeProducts);
            }

            if (AllServingSizeHaveType<ParsedLiquidAmount>(group, out var liquidProducts))
            {
                return ProcessParsedLiquidAmount(liquidProducts);
            }

            throw new InvalidOperationException("Unknown serving sizes");
        }

        private static IEnumerable<Product> ProcessParsedAmountServing(
            IReadOnlyList<ProcessedProductInfo<ParsedAmountServing>> group)
        {
            yield return MergeProducts(group,
                new[] { ServingType.Small, ServingType.Medium, ServingType.Large, ServingType.ExtraLarge });
        }

        private static IEnumerable<Product> ProcessParsedSizeMatch(
            IReadOnlyList<ProcessedProductInfo<ParsedSizeMatch>> group)
        {
            var sizeMap = new Dictionary<ParsedSizeMatch.ParsedSize, ServingType>
            {
                { ParsedSizeMatch.ParsedSize.Small, ServingType.Small },
                { ParsedSizeMatch.ParsedSize.Medium, ServingType.Medium },
                { ParsedSizeMatch.ParsedSize.Large, ServingType.Large },
            };

            var sizes = group.Select(x => x.ParsedServingSize!.Size).OrderBy(x => x).Select(x => sizeMap[x]).ToList();

            yield return MergeProducts(group, sizes);
        }

        private static IEnumerable<Product> ProcessParsedLiquidAmount(
            IReadOnlyList<ProcessedProductInfo<ParsedLiquidAmount>> group)
        {
            var factors = group.Select(x => x.Product.Servings[ServingType.Portion] / x.ParsedServingSize!.AmountInMl)
                .ToList();

            var averageFactor = factors.Average();
            var maxError = factors.Select(x => Math.Abs(x - averageFactor)).Max();

            if (maxError > 0.05)
            {
                foreach (var (product, _) in group)
                {
                    yield return product;
                }
            }
            else
            {
                var sizes = new[] { ServingType.Small, ServingType.Medium, ServingType.Large, ServingType.ExtraLarge };

                if (group.Count <= 2)
                    sizes = new[] { ServingType.Medium, ServingType.Large };

                var servingSizes = MatchProductsToServingTypes(group, sizes);
                var product = group.First().Product;

                yield return product with
                {
                    DefaultServing = ServingType.Medium, // does always exist
                    Servings = servingSizes
                        .Select(x =>
                            new KeyValuePair<ServingType, double>(x.Item2, x.Item1.ParsedServingSize!.AmountInMl))
                        .Append(new KeyValuePair<ServingType, double>(ServingType.Milliliter, 1))
                        .ToDictionary(x => x.Key, x => x.Value),
                    NutritionalInfo =
                    product.NutritionalInfo.ChangeVolume(product.NutritionalInfo.Volume / averageFactor) with
                    {
                        Volume = 100,
                    },
                    Tags = new Dictionary<string, bool> { { ProductProperties.TAG_LIQUID, true } },
                    Label = new Dictionary<string, ProductLabel>
                    {
                        { "de", new ProductLabel(group.First().ParsedServingSize!.NewName) },
                    },
                };
            }
        }

        private static Product MergeProducts<T>(IReadOnlyList<ProcessedProductInfo<T>> matchedProducts,
            IReadOnlyList<ServingType> assignedServingTypes) where T : ParsedServingSize
        {
            var servingSizes = MatchProductsToServingTypes(matchedProducts, assignedServingTypes);

            return matchedProducts.First().Product with
            {
                Servings = new Dictionary<ServingType, double>(servingSizes
                    .Select(x =>
                        new KeyValuePair<ServingType, double>(x.Item2,
                            x.Item1.Product.Servings[ServingType.Portion]))
                    .Concat(new[] { new KeyValuePair<ServingType, double>(ServingType.Gram, 1) }).ToList()),
                Label = new Dictionary<string, ProductLabel>
                {
                    { "de", new ProductLabel(matchedProducts.First().ParsedServingSize!.NewName) },
                },
                DefaultServing = servingSizes.First().Item2,
            };
        }

        /// <summary>
        ///     Match products with different portions to serving sizes
        /// </summary>
        private static IReadOnlyList<(ProcessedProductInfo<T>, ServingType)> MatchProductsToServingTypes<T>(
            IEnumerable<ProcessedProductInfo<T>> matchedProducts, IReadOnlyList<ServingType> assignedServingTypes)
            where T : ParsedServingSize
        {
            var amounts = matchedProducts.Select(x => (x.Product.Servings[ServingType.Portion], x))
                .GroupBy(x => x.Item1).ToDictionary(x => x.Key, x => x.First().x);

            if (amounts.Count > assignedServingTypes.Count)
                throw new ArgumentException(
                    "There are more matched products than possible servings that can be assigned");

            var counter = 0;
            return amounts.OrderBy(x => x.Key).Select(x => (x.Value, assignedServingTypes[counter++])).ToList();
        }

        private static Dictionary<string, List<ProcessedProductInfo<ParsedServingSize>>> GroupProductsByName(
            IEnumerable<Product> products)
        {
            var result = new Dictionary<string, List<ProcessedProductInfo<ParsedServingSize>>>();

            void AddProduct(string name, Product product, ParsedServingSize? serving)
            {
                if (!result.TryGetValue(name, out var existingProducts))
                    result.Add(name, existingProducts = new List<ProcessedProductInfo<ParsedServingSize>>());

                existingProducts.Add(new ProcessedProductInfo<ParsedServingSize>(product, serving));
            }

            foreach (var product in products)
            {
                if (ProductNameServingParser.TryParseServing(product, out var parsedServing))
                {
                    AddProduct(parsedServing.NewName, product, parsedServing);
                }
                else
                {
                    AddProduct(product.Label.Values.Single().Value, product, null);
                }
            }

            return result;
        }

        private static bool AllServingSizeHaveType<T>(IEnumerable<ProcessedProductInfo<ParsedServingSize>> products,
            [NotNullWhen(true)] out List<ProcessedProductInfo<T>>? result) where T : ParsedServingSize
        {
            var converted = new List<ProcessedProductInfo<T>>();
            result = null;

            foreach (var processedProductInfo in products)
            {
                if (processedProductInfo.ParsedServingSize is T o)
                {
                    converted.Add(new ProcessedProductInfo<T>(processedProductInfo.Product, o));
                }
                else
                {
                    return false;
                }
            }

            result = converted;
            return true;
        }

        private static Product PrefixLabelWithMcDonalds(Product product)
        {
            var label = product.Label.Single();
            return product with
            {
                Label = new Dictionary<string, ProductLabel>
                {
                    { label.Key, label.Value with { Value = "McDonalds " + label.Value.Value } },
                },
            };
        }

        private record ProcessedProductInfo<T>(Product Product, T? ParsedServingSize) where T : ParsedServingSize;
    }
}
