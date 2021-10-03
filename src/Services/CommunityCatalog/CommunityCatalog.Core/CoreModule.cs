using Autofac;
using CommunityCatalog.Core.Services;

namespace CommunityCatalog.Core
{
    public class CoreModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            base.Load(builder);

            builder.RegisterType<PasswordHandler>().AsImplementedInterfaces().InstancePerDependency();
        }
    }
}
