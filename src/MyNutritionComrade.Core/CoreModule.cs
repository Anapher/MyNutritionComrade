using Autofac;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Core.Services;

namespace MyNutritionComrade.Core
{
    public class CoreModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(ThisAssembly).AsClosedTypesOf(typeof(IUseCaseRequestHandler<,>)).AsImplementedInterfaces();
            builder.RegisterType<ProductPatchValidator>().As<IProductPatchValidator>().SingleInstance();
        }
    }
}
