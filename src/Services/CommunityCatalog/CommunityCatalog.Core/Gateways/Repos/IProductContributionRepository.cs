using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;

namespace CommunityCatalog.Core.Gateways.Repos
{
    public interface IProductContributionRepository
    {
        ValueTask Add(ProductContribution contribution);

        ValueTask<ProductContribution?> FindByPatchHash(string productId, string patchHash);

        ValueTask<ProductContribution?> FindById(string id);
    }
}
