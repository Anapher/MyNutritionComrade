using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace CommunityCatalog.Infrastructure.Data
{
    public abstract class MongoDataClass
    {
        private readonly MongoDbOptions _options;
        protected readonly MongoClient MongoClient;
        private readonly IMongoDatabase _database;

        protected MongoDataClass(IOptions<MongoDbOptions> options)
        {
            _options = options.Value;
            MongoClient = new MongoClient(options.Value.ConnectionString);
            _database = MongoClient.GetDatabase(options.Value.DatabaseName);
        }

        protected IMongoCollection<T> GetCollection<T>()
        {
            return _database.GetCollection<T>(_options.CollectionNames[typeof(T).Name]);
        }
    }
}
