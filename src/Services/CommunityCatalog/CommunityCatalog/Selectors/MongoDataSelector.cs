using CommunityCatalog.Infrastructure.Data;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace CommunityCatalog.Selectors
{
    public abstract class MongoDataSelector : IDataSelector
    {
        private readonly MongoDbOptions _options;
        protected readonly MongoClient MongoClient;
        private readonly IMongoDatabase _database;

        protected MongoDataSelector(IOptions<MongoDbOptions> options)
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
