using System.Net.Http;
using System.Text;
using Newtonsoft.Json;

namespace MyNutritionComrade.IntegrationTests._Helpers
{
    public class JsonContent : StringContent
    {
        public JsonContent(object value) : base(JsonConvert.SerializeObject(value), Encoding.UTF8, "application/json")
        {
        }
    }
}
