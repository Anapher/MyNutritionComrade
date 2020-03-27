using System.Net.Http;
using System.Text;
using Newtonsoft.Json;

namespace MyNutritionComrade.IntegrationTests.Utils
{
    public class JsonContent : StringContent
    {
        public JsonContent(object value) : base(JsonConvert.SerializeObject(value), Encoding.UTF8, "application/json")
        {
        }
    }
}
