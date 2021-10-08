using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;

namespace CommunityCatalog.Core.Gateways.Transactions
{
    public interface IProductUpdateTransaction
    {
        ValueTask UpdateProduct(VersionedProduct product, ProductContribution productContribution,
            int baseProductVersion);
    }
}
