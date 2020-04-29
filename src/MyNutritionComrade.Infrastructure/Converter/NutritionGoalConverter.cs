using System;
using System.Collections.Generic;
using System.Linq;
using MyNutritionComrade.Core.Domain.Entities.Goal;
using MyNutritionComrade.Infrastructure.Extensions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MyNutritionComrade.Infrastructure.Converter
{
    public class NutritionGoalConverter : JsonConverter
    {
        private static readonly IReadOnlyDictionary<Type, string> NutritionGoalTypeMap = new Dictionary<Type, string>
        {
            {typeof(CaloriesFixedNutritionGoal), "caloriesFixed"},
            {typeof(CaloriesMifflinStJeorNutritionGoal), "caloriesMifflinStJeor"},
            {typeof(ProteinByBodyweightNutritionGoal), "proteinByBodyweight"},
            {typeof(ProteinFixedNutritionGoal), "proteinFixed"},
            {typeof(NutrientDistribution), "proportionalDistribution"}
        };

        private static readonly IReadOnlyDictionary<string, Type> ReverseNutritionGoalTypeMap = NutritionGoalTypeMap.ToDictionary(x => x.Value, x => x.Key);

        public override void WriteJson(JsonWriter writer, object? value, JsonSerializer serializer)
        {
            if (value == null)
            {
                writer.WriteNull();
                return;
            }

            var jo = new JObject();
            var type = value.GetType();
            jo.Add("type", NutritionGoalTypeMap[type]);

            foreach (var prop in type.GetProperties())
                if (prop.CanRead)
                {
                    var propVal = prop.GetValue(value, null);
                    if (propVal != null) jo.Add(prop.Name.ToCamelCase(), JToken.FromObject(propVal, serializer));
                }

            jo.WriteTo(writer);
        }

        public override object? ReadJson(JsonReader reader, Type objectType, object? existingValue, JsonSerializer serializer)
        {
            var obj = JObject.Load(reader);

            if (obj.IsNullOrEmpty())
                return null;

            var typeToken = obj["type"] ?? obj["Type"];

            if (typeToken == null || !ReverseNutritionGoalTypeMap.TryGetValue(typeToken.Value<string>(), out var type))
                throw new ArgumentException($"The type {typeToken?.Value<string>()} is not supported.");

            return obj.ToObject(type);
        }

        public override bool CanConvert(Type objectType) => NutritionGoalTypeMap.ContainsKey(objectType);
    }
}
