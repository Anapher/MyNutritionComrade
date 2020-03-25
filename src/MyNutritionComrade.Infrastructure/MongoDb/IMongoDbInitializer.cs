using System.Threading.Tasks;

namespace MyNutritionComrade.Infrastructure.MongoDb
{
    public interface IMongoDbInitializer
    {
        Task Setup();
    }
}
