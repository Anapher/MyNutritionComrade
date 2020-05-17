using System;
using System.Collections.Generic;
using System.Linq;
using MyNutritionComrade.Infrastructure.Extensions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MyNutritionComrade.Infrastructure.Converter
{
    public class AbstractTypeJsonConverter<TType, TEnum> : JsonConverter<TType?> where TEnum : struct, Enum where TType : class
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
        public bool CamelCaseType { get; set; } = true;

        public override void WriteJson(JsonWriter writer, TType? value, JsonSerializer serializer)
        {
            if (value == null)
            {
                writer.WriteNull();
                return;
            }

            var jo = new JObject();
            var type = value.GetType();

            var t = _reverseTypeLookup[type].ToString();
            if (CamelCaseType) t = t.ToCamelCase();

            jo.Add(TypePropertyName, t);

            foreach (var prop in type.GetProperties())
                if (prop.CanRead)
                {
                    var propVal = prop.GetValue(value, null);
                    if (propVal != null) jo.Add(prop.Name.ToCamelCase(), JToken.FromObject(propVal, serializer));
                }

            jo.WriteTo(writer);
        }

        public override TType? ReadJson(JsonReader reader, Type objectType, TType? existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            var obj = JObject.Load(reader);

            if (obj.IsNullOrEmpty())
                return null;

            var typeToken = obj[TypePropertyName];

            if (typeToken == null || !_typeLookup.TryGetValue(Enum.Parse<TEnum>(typeToken.Value<string>()), out var type))
                throw new ArgumentException($"The type {typeToken?.Value<string>()} is not supported.");

            return (TType?) obj.ToObject(type);
        }

        public override bool CanRead { get; } = true;
        public override bool CanWrite { get; }
    }
}
