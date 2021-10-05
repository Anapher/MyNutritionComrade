using System;
using System.Security.Cryptography;
using System.Text;
using Newtonsoft.Json;

namespace CommunityCatalog.Core.Utilities
{
    public static class HashUtils
    {
        public static string GetMd5ForObject(object o)
        {
            var json = JsonConvert.SerializeObject(o, JsonConfig.Default);
            var data = Encoding.UTF8.GetBytes(json);

            using var md5 = MD5.Create();
            var hashData = md5.ComputeHash(data);
            return BitConverter.ToString(hashData).Replace("-", null);
        }
    }
}
