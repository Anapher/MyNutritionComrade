using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Infrastructure.Extensions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

namespace MyNutritionComrade.Infrastructure.Patch
{
    public static class PatchCreator
    {
        public static IEnumerable<PatchOperation> CreatePatch<T>(T source, T target, JsonSerializer? serializer = null) where T : class
        {
            if (serializer == null) serializer = new JsonSerializer {ContractResolver = new CamelCasePropertyNamesContractResolver()};

            var operations = new List<PatchOperation>();
            FillPatchForObject(source, target, typeof(T), string.Empty, operations, serializer);

            return operations;
        }

        private static void FillPatchForObject(object original, object modified, Type type, string path, List<PatchOperation> operations, JsonSerializer serializer)
        {
            foreach (var property in type.GetProperties())
            {
                var originalValue = property.GetValue(original);
                var newValue = property.GetValue(modified);

                var propertyName = property.Name.ToCamelCase();
                PatchValue(originalValue, newValue, path == string.Empty ? propertyName : $"{path}.{propertyName}", operations, serializer);
            }
        }

        private static void PatchValue(object? originalValue, object? newValue, string path, List<PatchOperation> operations, JsonSerializer serializer)
        {
            if (originalValue == newValue)
                return;

            if (originalValue == null)
            {
                operations.Add(new OpSetProperty(path, JToken.FromObject(newValue!, serializer)));
                return;
            }

            if (newValue == null)
            {
                operations.Add(new OpUnsetProperty(path));
                return;
            }

            var originalObject = JToken.FromObject(originalValue, serializer);
            var newObject = JToken.FromObject(newValue, serializer);

            if (originalObject.Type != newObject.Type)
            {
                operations.Add(new OpSetProperty(path, newObject));
            }
            else if (!string.Equals(originalObject.ToString(Formatting.None), newObject.ToString(Formatting.None)))
            {
                if (originalValue is IDictionary originalDict && newValue is IDictionary newDict)
                {
                    var originalItems = originalDict.Keys.Cast<object>().ToList();
                    var newItems = newDict.Keys.Cast<object>().ToList();

                    // Names removed in modified
                    foreach (var k in originalItems.Except(newItems)) operations.Add(new OpUnsetProperty($"{path}.{k}"));

                    // Names added in modified
                    foreach (var k in newItems.Except(originalItems)) operations.Add(new OpSetProperty($"{path}.{k}", JToken.FromObject(newDict[k]!, serializer)));

                    // Names in both
                    foreach (var k in newItems.Intersect(originalItems))
                        PatchValue(originalDict[k]!, newDict[k]!, $"{path}.{k}", operations, serializer);

                    return;
                }

                if (originalObject.Type == JTokenType.Object)
                {
                    FillPatchForObject(originalValue, newValue, originalValue.GetType(), path, operations, serializer);
                    return;
                }

                if (originalObject.Type == JTokenType.Array)
                    try
                    {
                        var originalItems = ((IEnumerable) originalValue).Cast<object>().ToList();
                        var newItems = ((IEnumerable) newValue).Cast<object>().ToList();

                        // Names removed in modified
                        operations.AddRange(originalItems.Except(newItems).Select(x => new OpRemoveItem(path, JToken.FromObject(x, serializer))));

                        // Names added in modified
                        operations.AddRange(newItems.Except(originalItems).Select(x => new OpAddItem(path, JToken.FromObject(x, serializer))));

                        return;
                    }
                    catch (InvalidOperationException)
                    {
                        // just replace
                    }

                // Replace values directly
                operations.Add(new OpSetProperty(path, newObject));
            }
        }
    }
}
