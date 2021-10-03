using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;

namespace CommunityCatalog.Core.Gateways.Repos
{
    public interface IProductRepository
    {
        ValueTask Add(VersionedProduct product);

        ValueTask<VersionedProduct?> FindById(string productId);
    }
}
