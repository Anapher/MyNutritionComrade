using Autofac;
using MyNutritionComrade.Selectors;

namespace MyNutritionComrade.Config
{
    public class PresentationModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            base.Load(builder);

            builder.RegisterType<FrequentlyUsedProducts>().As<IFrequentlyUsedProducts>();
            builder.RegisterType<ConsumedProductsOfTheDay>().As<IConsumedProductsOfTheDay>();
        }
    }
}
