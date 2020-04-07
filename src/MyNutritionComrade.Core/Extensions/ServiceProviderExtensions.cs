using System;

namespace MyNutritionComrade.Core.Extensions
{
    public static class ServiceProviderExtensions
    {
        public static T GetRequiredService<T>(this IServiceProvider serviceProvider)
        {
            var service = serviceProvider.GetService(typeof(T));
            if (service == null)
                throw new InvalidOperationException($"The service of type {serviceProvider} was not found.");

            return (T) service;
        }
    }
}
