using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;

namespace CommunityCatalog.Core.Gateways.Repos
{
    public interface IProductMirrorInfoRepository
    {
        ValueTask<ProductMirrorInfo?> GetByProductId(string productId);

        ValueTask Create(ProductMirrorInfo mirrorInfo);
    }
}
