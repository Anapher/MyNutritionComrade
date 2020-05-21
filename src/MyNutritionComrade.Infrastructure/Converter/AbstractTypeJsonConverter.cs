using System;
using System.Collections.Generic;
using System.Linq;
using MyNutritionComrade.Infrastructure.Extensions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MyNutritionComrade.Infrastructure.Converter
{
    public class AbstractTypeJsonConverter<TType, TEnum> : JsonConverter where TEnum : struct, Enum where TType : class
    {
        private readonly IReadOnlyDictionary<TEnum, Type> _typeLookup;
        private readonly IReadOnlyDictionary<Type, TEnum> _reverseTypeLookup;

        public AbstractTypeJsonConverter(IReadOnlyDictionary<TEnum, Type> typeLookup, bool canWrite = true)
        {
            _typeLookup = typeLookup;
            _reverseTypeLookup = typeLookup.ToDictionary(x => x.Value, x => x.Key);
            CanWrite = canWrite;
        }

        public string TypePropertyName { get; set; } = "type";

        public override void WriteJson(JsonWriter writer, object? value, JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }

        public override object? ReadJson(JsonReader reader, Type objectType, object? existingValue, JsonSerializer serializer)
        {
            var obj = JObject.Load(reader);

            if (obj.IsNullOrEmpty())
                return null;

            var typeToken = obj.GetValue(TypePropertyName, StringComparison.OrdinalIgnoreCase);

            if (typeToken == null || !_typeLookup.TryGetValue(Enum.Parse<TEnum>(typeToken.Value<string>(), true), out var type))
                throw new ArgumentException($"The type {typeToken?.Value<string>()} is not supported.");

            return (TType?) obj.ToObject(type, serializer);
        }

        public override bool CanConvert(Type objectType) => objectType.IsAbstract && typeof(TType).IsAssignableFrom(objectType);

        public override bool CanRead { get; } = true;
        public override bool CanWrite { get; } = false;
    }
}
