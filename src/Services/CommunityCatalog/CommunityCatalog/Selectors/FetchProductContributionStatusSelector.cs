using System.Threading.Tasks;
using CommunityCatalog.Core;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Extensions;
using CommunityCatalog.Infrastructure.Data;
using CommunityCatalog.Models.Response;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace CommunityCatalog.Selectors
{
    public interface IFetchProductContributionStatusSelector
    {
        Task<ProductContributionStatusDto> GetStatus(string productId);
    }

    public class FetchProductContributionStatusSelector : MongoDataSelector, IFetchProductContributionStatusSelector
    {
        private readonly IMongoCollection<ProductDocument> _productCollection;
        private readonly IMongoCollection<ProductContribution> _contributionCollection;

        public FetchProductContributionStatusSelector(IOptions<MongoDbOptions> options) : base(options)
        {
            _productCollection = GetCollection<ProductDocument>();
            _contributionCollection = GetCollection<ProductContribution>();
        }

        public async Task<ProductContributionStatusDto> GetStatus(string productId)
        {
            var product = await _productCollection.Find(x => x.ProductId == productId).FirstOrDefaultAsync();
            if (product == null)
                throw ProductError.ProductNotFound(productId).ToException();

            var readOnly = product.MirrorInfo?.ReadOnly == true;
            var openContributions = 0;

            if (!readOnly)
            {
                openContributions = (int)await _contributionCollection.Find(x =>
                    x.ProductId == productId && x.Status == ProductContributionStatus.Pending).CountDocumentsAsync();
            }

            return new ProductContributionStatusDto(readOnly, openContributions);
        }
    }
}
