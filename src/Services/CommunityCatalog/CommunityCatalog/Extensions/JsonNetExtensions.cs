using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CommunityCatalog.Extensions
{
    public static class JsonNetExtensions
    {
        public static async Task<T?> ReadFromJsonNetAsync<T>(this HttpContent content,
            JsonSerializer? serializer = null)
        {
            await using var contentStream = await content.ReadAsStreamAsync();

            serializer ??= new JsonSerializer();

            using var sr = new StreamReader(contentStream);
            using var jsonTextReader = new JsonTextReader(sr);

            return serializer.Deserialize<T>(jsonTextReader);
        }
    }
}
