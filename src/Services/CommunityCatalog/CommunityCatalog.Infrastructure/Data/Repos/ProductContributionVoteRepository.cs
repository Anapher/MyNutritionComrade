using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Gateways.Repos;
using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace CommunityCatalog.Infrastructure.Data.Repos
{
    public class ProductContributionVoteRepository : MongoRepo<ProductContributionVote>,
        IProductContributionVoteRepository, IMongoIndexBuilder
    {
        static ProductContributionVoteRepository()
        {
            BsonClassMap.RegisterClassMap<ProductContributionVote>(config =>
            {
                config.AutoMap();
                config.SetIgnoreExtraElements(true);
            });
        }

        public ProductContributionVoteRepository(IOptions<MongoDbOptions> options) : base(options)
        {
        }

        public async ValueTask Add(ProductContributionVote vote)
        {
            await Collection.InsertOneAsync(vote);
        }

        public async ValueTask RemoveVote(string contributionId, string userId)
        {
            await Collection.DeleteOneAsync(x => x.UserId == userId && x.ProductContributionId == contributionId);
        }

        public async ValueTask RemoveVote(ProductContributionVote vote)
        {
            await Collection.DeleteOneAsync(x =>
                x.ProductContributionId == vote.ProductContributionId && x.UserId == vote.UserId);
        }

        public async ValueTask<ProductContributionVoting> GetVoting(string productContributionId)
        {
            var approveVotes = await Collection.AsQueryable()
                .Where(x => x.ProductContributionId == productContributionId && x.Approve).CountAsync();
            var disapproveVotes = await Collection.AsQueryable()
                .Where(x => x.ProductContributionId == productContributionId && !x.Approve).CountAsync();

            return new ProductContributionVoting(approveVotes, disapproveVotes);
        }

        public async ValueTask<ProductContributionVote?> FindVote(string productContributionId, string userId)
        {
            return await Collection.Find(x => x.ProductContributionId == productContributionId && x.UserId == userId)
                .FirstOrDefaultAsync();
        }

        public async Task CreateIndexes()
        {
            await Collection.Indexes.CreateOneAsync(new CreateIndexModel<ProductContributionVote>(
                Builders<ProductContributionVote>.IndexKeys.Combine(
                    Builders<ProductContributionVote>.IndexKeys.Ascending(x => x.ProductContributionId),
                    Builders<ProductContributionVote>.IndexKeys.Ascending(x => x.UserId)),
                new CreateIndexOptions { Unique = true }));
        }
    }
}
