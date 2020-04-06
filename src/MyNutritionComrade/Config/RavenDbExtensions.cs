using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MyNutritionComrade.Infrastructure.Data.Indexes;
using MyNutritionComrade.Infrastructure.Extensions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Raven.Client.Documents;
using Raven.Client.Documents.Indexes;
using Raven.Client.Documents.Session;

namespace MyNutritionComrade.Config
{
    public class RavenDbOptions
    {
        public string[] Urls { get; set; } = new string[0];
        public string DatabaseName { get; set; } = "MyNutritionComrade";
        public string? CertPath { get; set; }
        public string? CertPass { get; set; }
    }

    public static class RavenDbExtensions
    {
        public static void AddRavenDb(this IServiceCollection services, IConfiguration configuration)
        {
            var options = new RavenDbOptions();
            configuration.Bind(options);

            var store = new DocumentStore
            {
                Urls = options.Urls,
                Database = options.DatabaseName,
                Conventions =
                {
                    FindCollectionName = type => type.Name.ToCamelCase(),
                    JsonContractResolver = new CamelCasePropertyNamesContractResolver(),
                    CustomizeJsonDeserializer = CustomizeJsonSerializer,
                    CustomizeJsonSerializer = CustomizeJsonSerializer
                }
            };

            if (!string.IsNullOrEmpty(options.CertPath))
                store.Certificate = new X509Certificate2(options.CertPath, options.CertPass);

            store.Initialize();

            IndexCreation.CreateIndexes(typeof(Product_ByCode).Assembly, store);

            services.AddSingleton<IDocumentStore>(store);
            services.AddScoped(serviceProvider => serviceProvider.GetService<IDocumentStore>().OpenAsyncSession(new SessionOptions {NoTracking = true}));
        }

        private static void CustomizeJsonSerializer(JsonSerializer obj)
        {
            obj.Converters.AddRequiredConverters();
        }
    }
}
