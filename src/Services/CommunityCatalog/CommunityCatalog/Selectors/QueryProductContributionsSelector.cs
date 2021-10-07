using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Response;
using CommunityCatalog.Infrastructure.Data;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace CommunityCatalog.Selectors
{
    public interface IQueryProductContributionsSelector
    {
        Task<IReadOnlyList<ProductContributionDto>> GetContributions(string productId, string userId,
            ProductContributionStatus? status);
    }

    public class QueryProductContributionsSelector : MongoDataSelector, IQueryProductContributionsSelector
    {
        private readonly IMapper _mapper;
        private readonly IMongoCollection<ProductContribution> _contributionCollection;
        private readonly IMongoCollection<ProductContributionVote> _contributionVoteCollection;

        public QueryProductContributionsSelector(IOptions<MongoDbOptions> options, IMapper mapper) : base(options)
        {
            _mapper = mapper;
            _contributionCollection = GetCollection<ProductContribution>();
            _contributionVoteCollection = GetCollection<ProductContributionVote>();
        }

        public async Task<IReadOnlyList<ProductContributionDto>> GetContributions(string productId, string userId,
            ProductContributionStatus? status)
        {
            var query = _contributionCollection.AsQueryable().Where(x => x.ProductId == productId);
            if (status != null)
                query = query.Where(x => x.Status == status);

            var contributions = await query.ToListAsync();
            var voteStatistics = await GetContributionStatisticsOfProduct(productId);
            var userVotes = await GetVotesOfUserForProductContributionsOfProduct(productId, userId);

            var result = new List<ProductContributionDto>();
            foreach (var contribution in contributions)
            {
                var voting = voteStatistics.FirstOrDefault(x => x.Id == contribution.Id);
                var userVote = userVotes.FirstOrDefault(x => x.ProductContributionId == contribution.Id);

                result.Add(MapContributionToDto(contribution, userId, voting, userVote));
            }

            return result;
        }

        private async Task<IReadOnlyList<SelectedContributionStatistics>> GetContributionStatisticsOfProduct(
            string productId)
        {
            return await _contributionVoteCollection.AsQueryable().Where(x => x.ProductId == productId)
                .GroupBy(x => x.ProductContributionId).Select(group =>
                    new SelectedContributionStatistics(group.Key, group.Count(), group.Count(x => x.Approve)))
                .ToListAsync();
        }

        private async Task<IReadOnlyList<ProductContributionVote>> GetVotesOfUserForProductContributionsOfProduct(
            string productId, string userId)
        {
            return await _contributionVoteCollection.AsQueryable()
                .Where(x => x.ProductId == productId && x.UserId == userId).ToListAsync();
        }

        private ProductContributionDto MapContributionToDto(ProductContribution contribution, string userId,
            SelectedContributionStatistics? votes, ProductContributionVote? userVote)
        {
            var dto = _mapper.Map<ProductContributionDto>(contribution);

            var createdByYou = contribution.UserId == userId;
            var statistics = new ProductContributionStatisticsDto(votes?.TotalVotes ?? 0, votes?.ApproveVotes ?? 0);

            YourVoteDto? voteDto = null;
            if (userVote != null)
                voteDto = new YourVoteDto(userVote.Approve, userVote.CreatedOn);

            return dto with { CreatedByYou = createdByYou, Statistics = statistics, YourVote = voteDto };
        }

        private record SelectedContributionStatistics(string Id, int TotalVotes, int ApproveVotes);
    }
}
