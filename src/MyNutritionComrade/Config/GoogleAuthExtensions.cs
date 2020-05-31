using System.Linq;
using Microsoft.Extensions.DependencyInjection;

namespace MyNutritionComrade.Config
{
    public static class GoogleAuthExtensions
    {
        public static void AddGoogleAuthValidator(this IServiceCollection services)
        {
            if (!services.Any(x => x.ServiceType == typeof(IGoogleAuthValidator)))
                services.AddSingleton<IGoogleAuthValidator, GoogleAuthValidator>();
        }
    }
}
