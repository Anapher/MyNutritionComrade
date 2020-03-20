using Autofac;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core
{
    public class CoreModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(ThisAssembly).AsClosedTypesOf(typeof(IUseCaseRequestHandler<,>)).AsImplementedInterfaces();
        }
    }
}
