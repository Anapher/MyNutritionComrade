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
            FillPatchForObject(original, modified, patch, "");

            return Builders<T>.Update.Combine(patch);
        }

        private static void FillPatchForObject<T>(object original, object modified, List<UpdateDefinition<T>> patch, string path)
        {
            var type = original.GetType();
            if (type != modified.GetType())
                throw new ArgumentException("Both objects must have the same type.");

            foreach (var property in type.GetProperties())
            {
                var originalValue = property.GetValue(original)!;
                var newValue = property.GetValue(modified)!;

                PatchValue(originalValue, newValue, patch, $"{path}.{property.Name}");
            }
        }

        private static void PatchValue<T>(object originalValue, object newValue, List<UpdateDefinition<T>> patch, string path)
        {
            if (originalValue == newValue)
                return;

            var originalObject = JToken.FromObject(originalValue);
            var newObject = JToken.FromObject(newValue);

            if (originalObject.Type != newObject.Type)
            {
                patch.Add(Builders<T>.Update.Set(path, newValue));
            }
            else if (!string.Equals(originalObject.ToString(Formatting.None), newObject.ToString(Formatting.None)))
            {
                if (originalObject.Type == JTokenType.Object)
                {
                    FillPatchForObject(originalValue, newValue, patch, path);
                    return;
                }

                if (originalObject.Type == JTokenType.Array)
                    try
                    {
                        var originalItems = ((IEnumerable) originalValue).Cast<object>().ToList();
                        var newItems = ((IEnumerable) newValue).Cast<object>().ToList();

                        // Names removed in modified
                        foreach (var k in originalItems.Except(newItems)) patch.Add(Builders<T>.Update.Pull(path, k));

                        // Names added in modified
                        foreach (var o in newItems.Except(originalItems)) patch.Add(Builders<T>.Update.AddToSet(path, o));

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
