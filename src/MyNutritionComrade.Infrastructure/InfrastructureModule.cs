using Autofac;
using MongoDB.Bson.Serialization;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Infrastructure.Auth;
using MyNutritionComrade.Infrastructure.Config;
using MyNutritionComrade.Infrastructure.Data;
using MyNutritionComrade.Infrastructure.Elasticsearch;
using MyNutritionComrade.Infrastructure.Identity.Repositories;
using MyNutritionComrade.Infrastructure.Interfaces;
using MyNutritionComrade.Infrastructure.MongoDb;

namespace MyNutritionComrade.Infrastructure
{
    public class InfrastructureModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<UserRepository>().As<IUserRepository>().InstancePerLifetimeScope();
            builder.RegisterType<JwtFactory>().As<IJwtFactory>().SingleInstance();
            builder.RegisterType<JwtHandler>().As<IJwtHandler>().SingleInstance();
            builder.RegisterType<TokenFactory>().As<ITokenFactory>().SingleInstance();
            builder.RegisterType<JwtValidator>().As<IJwtValidator>().SingleInstance();

            builder.RegisterAssemblyTypes(ThisAssembly).AsClosedTypesOf(typeof(IRepository<>)).AsImplementedInterfaces();
            builder.RegisterType<ProductsCollection>().AsSelf().As<IProductsCollection>().InstancePerLifetimeScope();
            builder.RegisterType<ElasticsearchUpdateHandler>().As<IProductsChangedEventHandler>();
            builder.RegisterType<BsonPatchFactory>().As<IBsonPatchFactory>().SingleInstance();

            BsonSerializer.RegisterSerializer(typeof(ServingType), new ServiceTypeBsonSerializer());
        }
    }
}
