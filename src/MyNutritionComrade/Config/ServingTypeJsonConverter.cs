using System;
using MyNutritionComrade.Core.Domain.Entities;
using Newtonsoft.Json;

namespace MyNutritionComrade.Config
{
    public class ServingTypeJsonConverter : JsonConverter<ServingType>
    {
        public override void WriteJson(JsonWriter writer, ServingType value, JsonSerializer serializer)
        {
            writer.WriteValue(value.Name);
        }

        public override ServingType ReadJson(JsonReader reader, Type objectType, ServingType existingValue, bool hasExistingValue, JsonSerializer serializer) =>
            new ServingType((string) reader.Value);
    }
}
