using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Adapters;
using Microsoft.AspNetCore.JsonPatch.Operations;
using MyNutritionComrade.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CommunityCatalog.Core.Extensions
{
    public static class JsonUtils
    {
        /// <summary>
        ///     Filter operations that actually modify the target object if they are applied
        /// </summary>
        /// <param name="operations">The operation list that should be filtered</param>
        /// <param name="targetObject">The target object</param>
        /// <param name="jsonSerializer">The json serialize to use to serialize the values</param>
        /// <returns>Return the operations that have an effect on applying</returns>
        public static IEnumerable<Operation> FilterRedundantOperations<T>(IEnumerable<Operation> operations,
            T targetObject, JsonSerializer jsonSerializer) where T : notnull
        {
            var target = JToken.FromObject(targetObject, jsonSerializer);

            foreach (var op in operations)
            {
                var modified = target.DeepClone();
                op.Apply(modified, new ObjectAdapter(jsonSerializer.ContractResolver, error => { }));

                var deserialized = modified.ToObject<T>(jsonSerializer)!;
                var finalValue = JToken.FromObject(deserialized, jsonSerializer);

                if (!JToken.DeepEquals(target, finalValue))
                {
                    yield return op;
                }
            }
        }

        public static ProductProperties ApplyPatchToProduct(IReadOnlyList<Operation> operations,
            ProductProperties product)
        {
            var patch = new JsonPatchDocument(operations.ToList(), JsonConfig.Default.ContractResolver);
            var copy = JToken.FromObject(product, JsonConfig.DefaultSerializer);

            patch.ApplyToWithDefaultOptions(copy);

            return copy.ToObject<ProductProperties>(JsonConfig.DefaultSerializer) ??
                   throw new InvalidOperationException("Invalid patch");
        }
    }
}
