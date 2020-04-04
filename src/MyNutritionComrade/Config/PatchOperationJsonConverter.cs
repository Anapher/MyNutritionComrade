using System;
using MyNutritionComrade.Core.Domain.Entities;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MyNutritionComrade.Config
{
    public class PatchOperationJsonConverter : JsonConverter<PatchOperation>
    {
        public override bool CanWrite { get; } = false;

        public override void WriteJson(JsonWriter writer, PatchOperation value, JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }

        public override PatchOperation ReadJson(JsonReader reader, Type objectType, PatchOperation existingValue, bool hasExistingValue,
            JsonSerializer serializer)
        {
            var obj = JObject.Load(reader);

            var typeToken = obj["type"];
            var pathToken = obj["path"];

            if (typeToken == null) throw new JsonException("The object must contain a type property");
            if (pathToken == null) throw new JsonException("The object must contain a path property");

            var type = Enum.Parse<PatchOperationType>(typeToken.Value<string>(), true);
            var path = pathToken.Value<string>();

            switch (type)
            {
                case PatchOperationType.Set:
                    return new OpSetProperty(path, obj["value"] ?? throw new JsonException("A set operation must have a value property"));
                case PatchOperationType.Unset:
                    return new OpUnsetProperty(path);
                case PatchOperationType.Add:
                    return new OpAddItem(path, obj["item"] ?? throw new JsonException("An add operation must have an item property"));
                case PatchOperationType.Remove:
                    return new OpRemoveItem(path, obj["item"] ?? throw new JsonException("A remove operation must have an item property"));
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}
