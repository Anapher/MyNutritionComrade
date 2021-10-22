using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Gateways.Transactions;
using CommunityCatalog.Infrastructure.Interfaces;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace CommunityCatalog.Infrastructure.Data.Transactions
{
    public class UpdateProductTransaction : MongoDataClass, IProductUpdateTransaction, ITransaction
    {
        public UpdateProductTransaction(IOptions<MongoDbOptions> options) : base(options)
        {
        }

        public async ValueTask UpdateProduct(ProductDocument product, ProductContribution productContribution,
            int baseProductVersion)
        {
            var productsCollection = GetCollection<ProductDocument>();
            var contributionsCollection = GetCollection<ProductContribution>();

            using var session = await MongoClient.StartSessionAsync();

            session.StartTransaction();

            await productsCollection.ReplaceOneAsync(session,
                Builders<ProductDocument>.Filter.Where(x =>
                    x.Product.Id == product.Product.Id && x.Version == baseProductVersion), product);

            await contributionsCollection.ReplaceOneAsync(session,
                Builders<ProductContribution>.Filter.Where(x =>
                    x.Id == productContribution.Id && x.Status == ProductContributionStatus.Pending),
                productContribution);

            await session.CommitTransactionAsync();
        }
    }
}
