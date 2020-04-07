using System;
using System.Collections.Generic;
using System.Linq;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Core.Utilities;
using Newtonsoft.Json.Linq;

namespace MyNutritionComrade.Core.Services
{
    public class ProductPatchGrouper : IProductPatchGrouper
    {
        public IEnumerable<PatchOperation[]> GroupPatch(IEnumerable<PatchOperation> operations)
        {
            var ops = operations.ToList();

            if (ops.Count(x => x.Path == "label") > 1)
                foreach (var addedLabel in ops.OfType<OpAddItem>().Where(x => x.Path == "label").ToList())
                {
                    var possibleReplacedElements = ops.OfType<OpRemoveItem>().Where(x =>
                        x.Path == "label" && x.Item.GetValue<string>("languageCode") == addedLabel.Item.GetValue<string>("languageCode")).ToList();

                    if (possibleReplacedElements.Count > 0)
                    {
                        var replacedElement = possibleReplacedElements.OrderBy(x =>
                            LevenshteinDistance.DamerauLevenshteinDistance(x.Item.GetValue<string>("value").ToCharArray(),
                                addedLabel.Item.GetValue<string>("value").ToCharArray(), int.MaxValue)).First();

                        ops.Remove(addedLabel);
                        ops.Remove(replacedElement);

                        yield return new PatchOperation[] { replacedElement, addedLabel };
                    }
                }

            var liquidTagOp = MoveItemIfFound(ops, new List<PatchOperation>(),
                x => x.Path == "tags" && ((x is OpAddItem addItem && addItem.Item.GetValue<string>() == ProductInfo.TagLiquid) ||
                                          (x is OpRemoveItem removeItem && removeItem.Item.GetValue<string>() == ProductInfo.TagLiquid)));
            if (liquidTagOp != null)
            {
                var list = new List<PatchOperation> { liquidTagOp };

                var newUnit = liquidTagOp.Type == PatchOperationType.Add ? "ml" : "g";
                var oldUnit = liquidTagOp.Type == PatchOperationType.Add ? "g" : "ml";

                MoveItemIfFound(ops, list, x => x.Path == $"servings.{newUnit}");
                MoveItemIfFound(ops, list, x => x.Path == $"servings.{oldUnit}");
                MoveItemIfFound(ops, list, x => x.Path == "defaultServing" && x is OpSetProperty p && p.Value.Value<string>() == newUnit);

                yield return list.ToArray();
            }

            var nutritionInfoChanges = ops.Where(x => x.Path.StartsWith("nutritionalInfo.")).ToArray();
            if (nutritionInfoChanges.Any())
            {
                foreach (var op in nutritionInfoChanges) ops.Remove(op);
                yield return nutritionInfoChanges;
            }

            foreach (var patchOperation in ops)
                yield return new[] { patchOperation };
        }

        private static T? MoveItemIfFound<T>(IList<T> items, IList<T> target, Func<T, bool> predicate) where T : class
        {
            var item = items.FirstOrDefault(predicate);
            if (item != null)
            {
                items.Remove(item);
                target.Add(item);
                return item;
            }

            return null;
        }
    }

    public static class JsonExtensions
    {
        public static T GetValue<T>(this JToken token, string key)
        {
            return ((JValue)token[key]!).Value<T>();
        }

        public static T GetValue<T>(this JToken token)
        {
            return ((JValue)token).Value<T>();
        }
    }
}
