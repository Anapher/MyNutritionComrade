using System;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MyNutritionComrade.Infrastructure.Elasticsearch;
using Nest;

namespace MyNutritionComrade.Config
{
    public static class ElasticsearchExtensions
    {
        public static void AddElasticsearch(this IServiceCollection services, IConfiguration configuration)
        {
            var url = configuration["Elasticsearch:Url"];
            var defaultIndex = configuration["Elasticsearch:Index"];

            var settings = new ConnectionSettings(new Uri(url)).DefaultIndex(defaultIndex).DisableDirectStreaming();
            var client = new ElasticClient(settings);

            client.Indices.Create(defaultIndex,
                descriptor => descriptor.Map<ProductSearchEntry>(m => m.AutoMap().Properties(p =>
                    p.Object<ProductSearchEntry>(o => o.Name(x => x.NutritionInformation).Enabled(false))
                        .Object<ProductSearchEntry>(o => o.Name(x => x.Servings).Enabled(false))
                        .Object<ProductSearchEntry>(o => o.Name(x => x.Label).Enabled(false)))));

            services.AddSingleton<IElasticClient>(client);
        }
    }
}
