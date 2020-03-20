using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MyNutritionComrade.Core.Interfaces.Services;

namespace MyNutritionComrade.Infrastructure.MongoDb
{
    public class BsonPatchFactory : IBsonPatchFactory
    {
        public BsonDocument CreatePatch<T>(T original, T modified) where T : class
        {
            var patch = MongoPatchFactory.CreatePatch(original, modified);
            var documentSerializer = BsonSerializer.SerializerRegistry.GetSerializer<T>();
            return patch.Render(documentSerializer, BsonSerializer.SerializerRegistry).ToBsonDocument();
        }
    }
}
