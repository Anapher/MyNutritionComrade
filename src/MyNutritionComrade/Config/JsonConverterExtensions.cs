using System.Collections.Generic;
using Microsoft.Extensions.DependencyInjection;
using MyNutritionComrade.Config.Converter;
using Newtonsoft.Json;

namespace MyNutritionComrade.Config
{
    public static class JsonConverterExtensions
    {
        public static void AddRequiredConverters(this IList<JsonConverter> converters)
        {
            converters.Add(new ServingTypeJsonConverter());
            converters.Add(new PatchOperationJsonConverter());
        }

        public static void AddDefaultJsonSettings(this IServiceCollection serviceCollection)
        {
            serviceCollection.AddTransient(x =>
            {
                var settings = new JsonSerializerSettings();
                settings.Converters.AddRequiredConverters();
                return settings;
            });
        }
    }
}
