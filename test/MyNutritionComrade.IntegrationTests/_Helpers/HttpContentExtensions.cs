using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace MyNutritionComrade.IntegrationTests._Helpers
{
    public static class HttpContentExtensions
    {
        public static async Task<T> DeserializeJsonObject<T>(this HttpContent content, JsonSerializer serializer = null)
        {
            var s = await content.ReadAsStringAsync();

            if (serializer != null)
                serializer.Deserialize<T>(new JsonTextReader(new StringReader(s)));

            return JsonConvert.DeserializeObject<T>(s);
        }
    }
}
