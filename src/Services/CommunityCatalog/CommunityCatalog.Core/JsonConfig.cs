using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace CommunityCatalog.Core
{
    public static class JsonConfig
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
            settings.NullValueHandling = NullValueHandling.Ignore;
        }

        public static JsonSerializer DefaultSerializer => JsonSerializer.Create(Default);
    }
}
