using System;
using System.Collections.Generic;
using MyNutritionComrade.Core.Domain.Entities.Account;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MyNutritionComrade.Infrastructure.Converter
{
    public class UserMetadataConverter : JsonConverter<UserMetadata?>
    {
        private static readonly IReadOnlyDictionary<UserType, Type> AbstractTypes =
            new Dictionary<UserType, Type> {{UserType.Google, typeof(GoogleUserMetadata)}, {UserType.Custom, typeof(CustomUserMetadata)}};

        public override bool CanWrite { get; } = false;

        public override void WriteJson(JsonWriter writer, UserMetadata? value, JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }

        public override UserMetadata? ReadJson(JsonReader reader, Type objectType, UserMetadata? existingValue, bool hasExistingValue,
            JsonSerializer serializer)
        {
            var obj = JObject.Load(reader);
            var typeToken = obj["userType"] ?? obj["UserType"];

            if (typeToken == null) throw new JsonException("The object must contain a userType property");

            var type = Enum.Parse<UserType>(typeToken.Value<string>(), true);
            return (UserMetadata?) obj.ToObject(AbstractTypes[type]);
        }
    }
}
