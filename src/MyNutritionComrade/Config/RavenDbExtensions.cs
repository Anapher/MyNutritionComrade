using System.Linq;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MyNutritionComrade.Infrastructure.Converter;
using MyNutritionComrade.Infrastructure.Data.Indexes;
using Newtonsoft.Json;
using Raven.Client.Documents;
using Raven.Client.Documents.Indexes;
using SessionOptions = Raven.Client.Documents.Session.SessionOptions;

namespace MyNutritionComrade.Config
{
    public static class RavenDbExtensions
    {
        public static void AddRavenDb(this IServiceCollection services, IConfiguration configuration)
        {
            var options = new RavenDbOptions();
            configuration.Bind(options);

            if (!services.Any(x => x.ServiceType == typeof(IDocumentStore)))
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

        public static void CreateRavenDbIndexes(this IWebHost webHost)
        {
            var logger = webHost.Services.GetRequiredService<ILogger<RavenDbOptions>>();
            logger.LogDebug("Create Ravendb indexes...");

            var documentStore = webHost.Services.GetRequiredService<IDocumentStore>();
            IndexCreation.CreateIndexes(typeof(Product_ByCode).Assembly, documentStore);

            logger.LogDebug("Indexes created successfully");
        }
    }
}
