using Autofac;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core
{
    public class CoreModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(ThisAssembly).AsClosedTypesOf(typeof(IUseCaseRequestHandler<,>)).AsImplementedInterfaces();
            builder.RegisterType<JsonPatchUtils>().As<IJsonPatchUtils>().SingleInstance();
        }
    }
}
