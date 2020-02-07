using Autofac;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Infrastructure.Auth;
using MyNutritionComrade.Infrastructure.Data;
using MyNutritionComrade.Infrastructure.Identity.Repositories;
using MyNutritionComrade.Infrastructure.Interfaces;

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
            builder.RegisterType<ProductsCollection>().As<IProductsCollection>().InstancePerLifetimeScope();
        }
    }
}
