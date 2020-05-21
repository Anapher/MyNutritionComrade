using Autofac;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Infrastructure.Auth;
using MyNutritionComrade.Infrastructure.Data.Repositories;
using MyNutritionComrade.Infrastructure.Interfaces;
using MyNutritionComrade.Infrastructure.Patch;

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

            builder.RegisterAssemblyTypes(ThisAssembly).AssignableTo<IRepository>().AsImplementedInterfaces();

            builder.RegisterType<ProductRepository>().As<IProductRepository>().SingleInstance();
            builder.RegisterType<ProductContributionRepository>().As<IProductContributionRepository>().SingleInstance();
            builder.RegisterType<ConsumedRepository>().As<IConsumedRepository>();
            builder.RegisterType<ManipulationUtils>().As<IObjectManipulationUtils>().SingleInstance();
        }
    }
}
