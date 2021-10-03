using Autofac;
using CommunityCatalog.Core.Gateways.Services;
using CommunityCatalog.Infrastructure.Auth;
using CommunityCatalog.Infrastructure.Interfaces;

namespace CommunityCatalog.Infrastructure
{
    public class InfrastructureModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            base.Load(builder);

            builder.RegisterType<JwtFactory>().As<IJwtFactory>().SingleInstance();
            builder.RegisterType<JwtHandler>().As<IJwtHandler>().SingleInstance();
            builder.RegisterType<TokenFactory>().As<ITokenFactory>().SingleInstance();

            builder.RegisterAssemblyTypes(ThisAssembly).AssignableTo<IRepository>().AsImplementedInterfaces();
        }
    }
}
