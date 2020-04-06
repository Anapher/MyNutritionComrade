using Autofac;
using MyNutritionComrade.Selectors;

namespace MyNutritionComrade.Config
{
    public class PresentationModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            base.Load(builder);

            builder.RegisterAssemblyTypes(ThisAssembly).AssignableTo<IDataSelector>().AsImplementedInterfaces().InstancePerDependency();
        }
    }
}
