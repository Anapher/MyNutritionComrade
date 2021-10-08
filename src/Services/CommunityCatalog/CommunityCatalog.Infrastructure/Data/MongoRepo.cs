using CommunityCatalog.Infrastructure.Interfaces;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace CommunityCatalog.Infrastructure.Data
{
    public abstract class MongoRepo<T> : MongoDataClass, IRepository
    {
        protected readonly IMongoCollection<T> Collection;

        protected MongoRepo(IOptions<MongoDbOptions> options) : base(options)
        {
            Collection = GetCollection<T>();
        }
    }
}
