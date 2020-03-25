using Autofac;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Infrastructure.Auth;
using MyNutritionComrade.Infrastructure.Config;
using MyNutritionComrade.Infrastructure.Data;
using MyNutritionComrade.Infrastructure.Data.Repositories;
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
            builder.RegisterType<ObjectPatchFactory>().As<IObjectPatchFactory>().SingleInstance();
            builder.RegisterType<ProductRepository>().As<IProductRepository>().SingleInstance();
            builder.RegisterType<ProductContributionsRepository>().As<IProductContributionsRepository>().SingleInstance();
            builder.RegisterType<MongoDbInitializer>().As<IMongoDbInitializer>();

            ConfigureBsonClasses();
        }

        public void ConfigureBsonClasses()
        {
            BsonSerializer.RegisterSerializer(typeof(ServingType), new ServingTypeBsonSerializer());

            BsonClassMap.RegisterClassMap<Product>(x =>
            {
                x.AutoMap();
                x.MapIdMember(x => x.Id).SetIdGenerator(new StringObjectIdGenerator());
            });

            BsonClassMap.RegisterClassMap<ProductInfo>(x =>
            {
                x.AutoMap();
                x.MapProperty(x => x.Code).SetIgnoreIfNull(true); // VERY IMPORTANT, else the sparse index on this property won't work
            });

            BsonClassMap.RegisterClassMap<ProductContribution>(x =>
            {
                x.AutoMap();
                x.MapIdMember(x => x.Id).SetIdGenerator(new StringObjectIdGenerator());
            });
        }
    }
}
