using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Models.Response;
using Newtonsoft.Json;

namespace MyNutritionComrade
{
    public class Commander
    {
        public static bool ExecuteCommandLine(IWebHost host, string[] args, [NotNullWhen(true)] out int? exitCode)
        {
            if (args[0] == "/import_products")
            {
                exitCode = ImportProducts(host, args[1], args[2]);
                return true;
            }

            exitCode = null;
            return false;
        }

        public static int ImportProducts(IWebHost host, string jsonFile, string userId)
        {
            var logger = host.Services.GetRequiredService<ILogger<Commander>>();
            logger.LogInformation("Read products from {file}", jsonFile);

            List<ProductDto> products;

            var serializer = host.Services.GetRequiredService<JsonSerializer>();
            using (var streamReader = new StreamReader(jsonFile))
            using (var jsonReader = new JsonTextReader(streamReader))
            {
                products = serializer.Deserialize<List<ProductDto>>(jsonReader)!;
            }

            logger.LogInformation("Found {count} products", products.Count);

            using (var scope = host.Services.CreateScope())
            {
                foreach (var product in products)
                {
                    var useCase = scope.ServiceProvider.GetRequiredService<IAddProductUseCase>();
                    useCase.Handle(new AddProductRequest(product, userId) {RequestedProductId = !string.IsNullOrEmpty(product.Id) ? product.Id : null}).Wait();
                    logger.LogInformation("Created product {id} ({label})", product.Id, product.Label.Values.First().Value);
                }
            }

            return 0;
        }

        //public static async Task MigrateProductContributions(IAsyncDocumentSession session, JsonSerializer serializer)
        //{
        //    var contributions = await session.Query<ProductContribution>().ToListAsync();
        //    foreach (var contribution in contributions)
        //    {
        //        foreach (var operation in contribution.Patch.ToList())
        //        {
        //            if (operation.Path == "label" && operation is OpAddItem addItem)
        //            {
        //                contribution.Patch.Remove(operation);
        //                var info = addItem.Item.ToObject<OldProductLabel>(serializer);

        //                var existing = contribution.Patch.FirstOrDefault(x => x.Path == $"label.{info.LanguageCode}");
        //                if (existing != null && existing is OpSetProperty setOp)
        //                {
        //                    var data = setOp.Value.ToObject<ProductLabel>(serializer);
        //                    var tags = data!.Tags.Length == 0 ? new[] {info.Value} : data.Tags.Concat(info.Value.Yield()).ToArray();
        //                    contribution.Patch.Remove(setOp);
        //                    contribution.Patch.Add(new OpSetProperty(setOp.Path, JToken.FromObject(new ProductLabel(data.Value, tags), serializer)));
        //                }
        //                else
        //                    contribution.Patch.Add(new OpSetProperty($"label.{info.LanguageCode}",
        //                        JToken.FromObject(new ProductLabel(info.Value), serializer)));
        //            }
        //        }

        //        foreach (var operation in contribution.Patch.ToList())
        //        {
        //            if (operation.Path == "label" && operation is OpRemoveItem removeItem)
        //            {
        //                contribution.Patch.Remove(operation);
        //                var info = removeItem.Item.ToObject<OldProductLabel>(serializer);

        //                if (contribution.Patch.All(x => x.Path != $"label.{info.LanguageCode}"))
        //                    contribution.Patch.Add(new OpUnsetProperty($"label.{info.LanguageCode}"));
        //            }
        //        }

        //        typeof(ProductContribution).GetProperty("PatchHash")!.SetValue(contribution, HashUtils.GetMd5ForObject(contribution.Patch));
        //        await session.StoreAsync(contribution);
        //    }

        //    await session.SaveChangesAsync();
        //}

        //private struct OldProductLabel
        //{
        //    public string LanguageCode { get; set; }
        //    public string Value { get; set; }
        //}
    }
}
