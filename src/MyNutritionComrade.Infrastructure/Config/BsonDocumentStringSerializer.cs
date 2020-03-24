using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;

namespace MyNutritionComrade.Infrastructure.Config
{
    public class BsonDocumentStringSerializer : IBsonSerializer
    {
        public object Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
        {
            var s = context.Reader.ReadString();
            return BsonDocument.Parse(s);
        }

        public void Serialize(BsonSerializationContext context, BsonSerializationArgs args, object value)
        {
            var originalDoc = (BsonDocument) value;
            context.Writer.WriteString(originalDoc.ToString());
        }

        public Type ValueType { get; } = typeof(BsonDocument);
    }
}
