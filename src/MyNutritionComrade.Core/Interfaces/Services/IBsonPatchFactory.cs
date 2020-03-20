using MongoDB.Bson;

namespace MyNutritionComrade.Core.Interfaces.Services
{
    public interface IBsonPatchFactory
    {
        BsonDocument CreatePatch<T>(T original, T modified) where T : class;
    }
}
