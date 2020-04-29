using Newtonsoft.Json.Linq;

namespace MyNutritionComrade.Infrastructure.Extensions
{
    public static class JsonExtensions
    {
        public static bool IsNullOrEmpty(this JToken token) =>
            token == null || token.Type == JTokenType.Array && !token.HasValues || token.Type == JTokenType.Object && !token.HasValues ||
            token.Type == JTokenType.String && token.ToString() == string.Empty || token.Type == JTokenType.Null;
    }
}
