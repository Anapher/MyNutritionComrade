using CommunityCatalog.Infrastructure.Data;
using Microsoft.Extensions.Options;

namespace CommunityCatalog.Selectors
{
    public abstract class MongoDataSelector : MongoDataClass, IDataSelector
    {
        protected MongoDataSelector(IOptions<MongoDbOptions> options) : base(options)
        {
        }
    }
}
