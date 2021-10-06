using Autofac;
using CommunityCatalog.Selectors;

namespace CommunityCatalog
{
    public class PresentationModule : Module

    {
        protected override void Load(ContainerBuilder builder)
        {
            base.Load(builder);
            builder.RegisterAssemblyTypes(ThisAssembly).AssignableTo<IDataSelector>().AsImplementedInterfaces()
                .InstancePerDependency();
        }
    }
}
