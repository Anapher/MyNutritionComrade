using System;
using MongoDB.Bson.Serialization;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Infrastructure.Config
{
    public class ServiceTypeBsonSerializer : IBsonSerializer
    {
        public object Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args) => new ServingType(context.Reader.ReadString());

        public void Serialize(BsonSerializationContext context, BsonSerializationArgs args, object value)
        {
            context.Writer.WriteString(((ServingType) value).Name);
        }

        public Type ValueType { get; } = typeof(ServingType);
    }
}
