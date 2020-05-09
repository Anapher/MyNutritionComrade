using System.Collections.Generic;
using Newtonsoft.Json;

namespace MyNutritionComrade.Infrastructure.Converter
{
    public static class JsonConverterExtensions
    {
        public static void AddRequiredConverters(this IList<JsonConverter> converters)
        {
            converters.Add(new ServingTypeJsonConverter());
            converters.Add(new PatchOperationJsonConverter());
            converters.Add(new NutritionGoalConverter());
            converters.Add(new UserMetadataConverter());
        }
    }
}
