using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace MyNutritionComrade.IntegrationTests.Utils
{
    public static class HttpContentExtensions
    {
        public static async Task<T> DeserializeJsonObject<T>(this HttpContent content)
        {
            var s = await content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(s);
        }
    }
}
