using System;
using MongoDB.Bson.Serialization;
using MyNutritionComrade.Models;

namespace CommunityCatalog.Infrastructure.Serialization
{
    public class ServingTypeBsonSerializer : IBsonSerializer<ServingType>
    {
        object IBsonSerializer.Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
        {
            return Deserialize(context, args);
        }

        public void Serialize(BsonSerializationContext context, BsonSerializationArgs args, ServingType value)
        {
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
