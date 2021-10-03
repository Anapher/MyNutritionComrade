using System.Threading.Tasks;

namespace CommunityCatalog.Infrastructure.Data
{
    public interface IMongoIndexBuilder
    {
        Task CreateIndexes();
    }
}
