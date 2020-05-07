using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MyNutritionComrade.Infrastructure.Converter;
using Newtonsoft.Json;
using Raven.Client.Documents;
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

            services.AddSingleton<IDocumentStore>((x) =>
            {
                var store = new DocumentStore
                {
                    Urls = options.Urls,
                    Database = options.DatabaseName,
                    Conventions =
                    {
                        CustomizeJsonDeserializer = CustomizeJsonSerializer,
                        CustomizeJsonSerializer = CustomizeJsonSerializer,
                        FindCollectionName = type => type.Name,
                    }
                };

                if (!string.IsNullOrEmpty(options.CertPath))
                    store.Certificate = new X509Certificate2(options.CertPath, options.CertPass);

                store.Initialize();

                return store;
            });

            services.AddScoped(serviceProvider => serviceProvider.GetService<IDocumentStore>().OpenAsyncSession(new SessionOptions {NoTracking = true}));
        }

        private static void CustomizeJsonSerializer(JsonSerializer obj)
        {
            obj.Converters.AddRequiredConverters();
        }
    }
}
