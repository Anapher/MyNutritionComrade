using System;
using System.Security.Cryptography;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace MyNutritionComrade.Core.Utilities
{
    public static class HashUtils
    {
        private static readonly JsonSerializerSettings JsonSerializerSettings;

        static HashUtils()
        {
            JsonSerializerSettings = new JsonSerializerSettings {ContractResolver = new CamelCasePropertyNamesContractResolver()};
            JsonSerializerSettings.Converters.Add(new StringEnumConverter(new CamelCaseNamingStrategy()));
        }

        public static string GetMd5ForObject(object o)
        {
            var json = JsonConvert.SerializeObject(o, JsonSerializerSettings);
            var data = Encoding.UTF8.GetBytes(json);

            using var md5 = MD5.Create();
            var hashData = md5.ComputeHash(data);
            return BitConverter.ToString(hashData).Replace("-", null);
        }
    }
}
