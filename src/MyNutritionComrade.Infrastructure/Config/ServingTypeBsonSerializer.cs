using System;
using MongoDB.Bson.Serialization;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Infrastructure.Config
{
    public class ServingTypeBsonSerializer : IBsonSerializer<ServingType>
    {
        object IBsonSerializer.Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args) => Deserialize(context, args);

        public void Serialize(BsonSerializationContext context, BsonSerializationArgs args, ServingType value)
        {
            var originalDoc = value;
            context.Writer.WriteString(value.ToString());
        }

        public ServingType Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
        {
            var s = context.Reader.ReadString();
            return new ServingType(s);
        }

        public void Serialize(BsonSerializationContext context, BsonSerializationArgs args, object value)
        {
            Serialize(context, args, (ServingType)value);
        }

        public Type ValueType { get; } = typeof(ServingType);
    }
}
