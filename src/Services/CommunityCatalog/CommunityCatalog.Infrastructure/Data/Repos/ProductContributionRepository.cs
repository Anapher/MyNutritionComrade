using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Gateways.Repos;
using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace CommunityCatalog.Infrastructure.Data.Repos
{
    public class ProductContributionRepository : MongoRepo<ProductContribution>, IProductContributionRepository,
        IMongoIndexBuilder
    {
        static ProductContributionRepository()
        {
            BsonClassMap.RegisterClassMap<ProductContribution>(config =>
            {
                config.AutoMap();
                config.MapIdMember(x => x.Id);
            });
        }

        public ProductContributionRepository(IOptions<MongoDbOptions> options) : base(options)
        {
        }

        public async ValueTask Add(ProductContribution contribution)
        {
            await Collection.InsertOneAsync(contribution);
        }

        public async ValueTask<ProductContribution?> FindByPatchHash(string productId, string patchHash)
        {
            return await Collection.Find(x => x.ProductId == productId && x.PatchHash == patchHash)
                .FirstOrDefaultAsync();
        }

        public async ValueTask<ProductContribution?> FindById(string id)
        {
            return await Collection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateIndexes()
        {
            await Collection.Indexes.CreateOneAsync(new CreateIndexModel<ProductContribution>(
                Builders<ProductContribution>.IndexKeys.Combine(
                    Builders<ProductContribution>.IndexKeys.Ascending(x => x.ProductId),
                    Builders<ProductContribution>.IndexKeys.Ascending(x => x.PatchHash)),
                new CreateIndexOptions<ProductContribution>
                {
                    Unique = true,
                    PartialFilterExpression =
                        Builders<ProductContribution>.Filter.Eq(x => x.Status, ProductContributionStatus.Pending),
                }));
            await Collection.Indexes.CreateOneAsync(new CreateIndexModel<ProductContribution>(
                Builders<ProductContribution>.IndexKeys.Combine(
                    Builders<ProductContribution>.IndexKeys.Ascending(x => x.ProductId),
                    Builders<ProductContribution>.IndexKeys.Ascending(x => x.AppliedOnVersion)),
                new CreateIndexOptions<ProductContribution>
                {
                    Unique = true,
                    PartialFilterExpression =
                        Builders<ProductContribution>.Filter.Not(
                            Builders<ProductContribution>.Filter.Eq(x => x.AppliedOnVersion, null)),
                }));
        }
    }
}
