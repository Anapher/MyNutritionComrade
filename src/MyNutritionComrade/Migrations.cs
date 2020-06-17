using System.Linq;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Extensions;
using MyNutritionComrade.Core.Utilities;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Raven.Client.Documents;
using Raven.Client.Documents.Session;

namespace MyNutritionComrade
{
    public static class Migrations
    {
        public static async Task MigrateProductContributions(IAsyncDocumentSession session, JsonSerializer serializer)
        {
            var contributions = await session.Query<ProductContribution>().ToListAsync();
            foreach (var contribution in contributions)
            {
                foreach (var operation in contribution.Patch.ToList())
                {
                    if (operation.Path == "label" && operation is OpAddItem addItem)
                    {
                        contribution.Patch.Remove(operation);
                        var info = addItem.Item.ToObject<OldProductLabel>(serializer);

                        var existing = contribution.Patch.FirstOrDefault(x => x.Path == $"label.{info.LanguageCode}");
                        if (existing != null && existing is OpSetProperty setOp)
                        {
                            var data = setOp.Value.ToObject<ProductLabel>(serializer);
                            var tags = data!.Tags.Length == 0 ? new[] {info.Value} : data.Tags.Concat(info.Value.Yield()).ToArray();
                            contribution.Patch.Remove(setOp);
                            contribution.Patch.Add(new OpSetProperty(setOp.Path, JToken.FromObject(new ProductLabel(data.Value, tags), serializer)));
                        }
                        else
                            contribution.Patch.Add(new OpSetProperty($"label.{info.LanguageCode}",
                                JToken.FromObject(new ProductLabel(info.Value), serializer)));
                    }
                }

                foreach (var operation in contribution.Patch.ToList())
                {
                    if (operation.Path == "label" && operation is OpRemoveItem removeItem)
                    {
                        contribution.Patch.Remove(operation);
                        var info = removeItem.Item.ToObject<OldProductLabel>(serializer);

                        if (contribution.Patch.All(x => x.Path != $"label.{info.LanguageCode}"))
                            contribution.Patch.Add(new OpUnsetProperty($"label.{info.LanguageCode}"));
                    }
                }

                typeof(ProductContribution).GetProperty("PatchHash")!.SetValue(contribution, HashUtils.GetMd5ForObject(contribution.Patch));
                await session.StoreAsync(contribution);
            }

            await session.SaveChangesAsync();
        }

        private struct OldProductLabel
        {
            public string LanguageCode { get; set; }
            public string Value { get; set; }
        }
    }
}
