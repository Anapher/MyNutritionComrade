using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace CommunityCatalog.Core
{
    public static class JsonOptions
    {
        public static JsonSerializerSettings Default
        {
            get
            {
                var settings = new JsonSerializerSettings();
                Apply(settings);
                return settings;
            }
        }

        public static void Apply(JsonSerializerSettings settings)
        {
            settings.ContractResolver = new CamelCasePropertyNamesContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy(true, true),
            };
            settings.Converters.Add(new StringEnumConverter(new CamelCaseNamingStrategy(true, true)));
        }

        public static JsonSerializer DefaultSerializer => JsonSerializer.Create(Default);
    }
}
