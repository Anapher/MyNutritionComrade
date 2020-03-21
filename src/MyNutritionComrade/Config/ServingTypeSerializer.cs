using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Config
{
    public class ServingTypeSerializer : JsonConverter<ServingType>
    {
        public override ServingType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) => new ServingType(reader.GetString());

        public override void Write(Utf8JsonWriter writer, ServingType value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.Name);
        }
    }
}
