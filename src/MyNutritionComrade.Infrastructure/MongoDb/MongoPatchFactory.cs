using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MyNutritionComrade.Infrastructure.MongoDb
{
    public static class MongoPatchFactory
    {
        /// <summary>
        ///     Create patch with changes by comparing two objects
        /// </summary>
        /// <param name="original">The original object</param>
        /// <param name="modified">The modified object</param>
        /// <returns>Return json patch with changes to update the <see cref="original" /> to <see cref="modified" /></returns>
        public static UpdateDefinition<T> CreatePatch<T>(T original, T modified) where T : class
        {
            var patch = new List<UpdateDefinition<T>>();
            FillPatchForObject(original, modified, typeof(T), patch, string.Empty);

            return Builders<T>.Update.Combine(patch);
        }

        private static void FillPatchForObject<T>(object original, object modified, Type type, List<UpdateDefinition<T>> patch, string path)
        {
            foreach (var property in type.GetProperties())
            {
                var originalValue = property.GetValue(original)!;
                var newValue = property.GetValue(modified)!;

                PatchValue(originalValue, newValue, patch, path == string.Empty ? property.Name : $"{path}.{property.Name}");
            }
        }

        private static void PatchValue<T>(object originalValue, object newValue, List<UpdateDefinition<T>> patch, string path)
        {
            if (originalValue == newValue)
                return;

            if (originalValue == null || newValue == null)
            {
                patch.Add(Builders<T>.Update.Set(path, newValue));
                return;
            }

            var originalObject = JToken.FromObject(originalValue);
            var newObject = JToken.FromObject(newValue);

            if (originalObject.Type != newObject.Type)
            {
                patch.Add(Builders<T>.Update.Set(path, newValue));
            }
            else if (!string.Equals(originalObject.ToString(Formatting.None), newObject.ToString(Formatting.None)))
            {
                if (originalValue is IDictionary originalDict && newValue is IDictionary newDict)
                {
                    var originalItems = originalDict.Keys.Cast<object>().ToList();
                    var newItems = newDict.Keys.Cast<object>().ToList();

                    // Names removed in modified
                    foreach (var k in originalItems.Except(newItems)) patch.Add(Builders<T>.Update.Unset($"{path}.{k}"));

                    // Names added in modified
                    foreach (var k in newItems.Except(originalItems)) patch.Add(Builders<T>.Update.Set($"{path}.{k}", newDict[k]));

                    // Names in both
                    foreach (var k in newItems.Intersect(originalItems))
                        PatchValue(originalDict[k]!, newDict[k]!, patch, $"{path}.{k}");

                    return;
                }

                if (originalObject.Type == JTokenType.Object)
                {
                    FillPatchForObject(originalValue, newValue, originalValue.GetType(), patch, path);
                    return;
                }

                if (originalObject.Type == JTokenType.Array)
                    try
                    {
                        var originalItems = ((IEnumerable) originalValue).Cast<object>().ToList();
                        var newItems = ((IEnumerable) newValue).Cast<object>().ToList();

                        // Names removed in modified
                        var removedItems = originalItems.Except(newItems).ToList();
                        if (removedItems.Count == 1)
                            patch.Add(Builders<T>.Update.Pull(path, removedItems.Single()));
                        else if (removedItems.Count > 1)
                            patch.Add(Builders<T>.Update.PullAll(path, removedItems));

                        // Names added in modified
                        var addedItems = newItems.Except(originalItems).ToList();
                        if (addedItems.Count == 1)
                            patch.Add(Builders<T>.Update.AddToSet(path, addedItems.Single()));
                        else if (addedItems.Count > 1)
                            patch.Add(Builders<T>.Update.AddToSetEach(path, addedItems));

                        return;
                    }
                    catch (InvalidOperationException)
                    {
                        // just replace
                    }

                // Replace values directly
                patch.Add(Builders<T>.Update.Set(path, newValue));
            }
        }
    }
}
