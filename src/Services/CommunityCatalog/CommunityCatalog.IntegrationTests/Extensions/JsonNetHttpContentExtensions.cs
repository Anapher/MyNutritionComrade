using System.Net.Http;
using System.Threading.Tasks;
using CommunityCatalog.Core;
using Newtonsoft.Json;

namespace CommunityCatalog.IntegrationTests.Extensions
{
    public static class JsonNetHttpContentExtensions
    {
        public static async Task<T?> ReadFromJsonNetAsync<T>(this HttpContent httpContent)
        {
            var s = await httpContent.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(s, JsonConfig.Default);
        }
    }
}
