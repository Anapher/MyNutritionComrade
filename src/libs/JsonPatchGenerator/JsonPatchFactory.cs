using System;
using System.Collections;
using System.Linq;
using Microsoft.AspNetCore.JsonPatch;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace JsonPatchGenerator
{
    public static class JsonPatchFactory
    {
        /// <summary>
        ///     Create patch with changes by comparing two objects
        /// </summary>
        /// <param name="original">The original object</param>
        /// <param name="modified">The modified object</param>
        /// <returns>Return json patch with changes to update the <see cref="original"/> to <see cref="modified"/></returns>
        public static JsonPatchDocument CreatePatch(object original, object modified)
        {
            var patch = new JsonPatchDocument();
            FillPatchForObject(original, modified, patch, "");

            return patch;
        }

        private static void FillPatchForObject(object original, object modified, JsonPatchDocument patch, string path)
        {
            var type = original.GetType();
            if (type != modified.GetType())
                throw new ArgumentException("Both objects must have the same type.");

            foreach (var property in type.GetProperties())
            {
                var originalValue = property.GetValue(original);
                var newValue = property.GetValue(modified);

                PatchValue(originalValue, newValue, patch, $"{path}/{property.Name}");
            }
        }

        private static void PatchValue(object originalValue, object newValue, JsonPatchDocument patch, string path)
        {
            if (originalValue == newValue)
                return;

            if (originalValue == null)
            {
                patch.Replace(path, JToken.FromObject(newValue));
                return;
            }

            if (newValue == null)
            {
                patch.Remove(path);
                return;
            }

            var originalObject = JToken.FromObject(originalValue);
            var newObject = JToken.FromObject(newValue);

            if (originalObject.Type != newObject.Type)
            {
                patch.Replace(path, newObject);
            }
            else if (!string.Equals(originalObject.ToString(Formatting.None), newObject.ToString(Formatting.None)))
            {
                if (originalObject.Type == JTokenType.Object)
                {
                    FillPatchForObject(originalValue, newValue, patch, path);
                    return;
                }

                if (originalObject.Type == JTokenType.Array)
                {
                    try
                    {
                        var originalItems = ((IEnumerable) originalValue).Cast<object>().ToDictionary(x => x.GetKey() ?? throw new InvalidOperationException("No key defined"), x => x);
                        var newItems = ((IEnumerable) newValue).Cast<object>().ToDictionary(x => x.GetKey() ?? throw new InvalidOperationException("No key defined"), x => x);

                        if (newItems.Select(x => x.Key).Distinct().Count() != newItems.Count)
                            throw new ArgumentException("The keys of the items must be unique.");

                        // Names removed in modified
                        foreach (var k in originalItems.Except(newItems, KeyEqualityComparer.Instance))
                        {
                            patch.Remove(path + "/" + k.Key);
                        }

                        // Names added in modified
                        foreach (var o in newItems.Except(originalItems, KeyEqualityComparer.Instance))
                        {
                            patch.Add(path, JObject.FromObject(o.Value));
                        }

                        // Present in both
                        foreach (var k in originalItems.Intersect(newItems, KeyEqualityComparer.Instance))
                        {
                            var originalVal = originalItems.First(x => x.Key == k.Key);
                            var newVal = newItems.First(x => x.Key == k.Key);

                            PatchValue(originalVal.Value, newVal.Value, patch, $"{path}/{k.Key}");
                        }

                        return;
                    }
                    catch (InvalidOperationException)
                    {
                        // just replace
                    }
                }

                // Replace values directly
                patch.Replace(path, newObject);
            }
        }
    }
}
