using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.GatewayResponses.Repositories;
using MyNutritionComrade.Infrastructure.Data.Indexes;
using MyNutritionComrade.Models.Response;
using Raven.Client.Documents;
using Raven.Client.Documents.Linq;
using Raven.Client.Documents.Session;

namespace MyNutritionComrade.Selectors
{
    public interface IPendingContributionsSelector : IDataSelector
    {
        Task<IEnumerable<ProductContributionDto>> GetPendingContributions(string productId, string userId);
    }

    public class PendingContributionsSelector : IPendingContributionsSelector
    {
        private readonly IMapper _mapper;
        private readonly IAsyncDocumentSession _session;

        public PendingContributionsSelector(IAsyncDocumentSession session, IMapper mapper)
        {
            _session = session;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ProductContributionDto>> GetPendingContributions(string productId, string userId)
        {
            var pending = await _session.Query<ProductContribution, ProductContribution_ByProductAndStatus>()
                .Where(x => x.Status == ProductContributionStatus.Pending && x.ProductId == productId).ToListAsync();

            var contributionIds = pending.Select(x => x.Id).ToList();

            var voting = await _session.Query<ProductContributionVoting, ProductContributionVote_ByProductContribution>()
                .Where(x => x.ProductContributionId.In(contributionIds)).ToListAsync();

            var votes = await _session.Query<ProductContributionVote, ProductContributionVote_ByUserAndContribution>()
                .Where(x => x.UserId == userId && x.ProductContributionId.In(contributionIds)).ToListAsync();

            var result = new List<ProductContributionDto>();
            foreach (var contribution in pending)
                result.Add(MapToDto(contribution, voting.FirstOrDefault(x => x.ProductContributionId == contribution.Id),
                    votes.FirstOrDefault(x => x.ProductContributionId == contribution.Id), userId, _mapper));

            return result;
        }

        public static ProductContributionDto MapToDto(ProductContribution contribution, ProductContributionVoting? voting, ProductContributionVote? vote,
            string userId, IMapper mapper)
        {
            var dto = mapper.Map<ProductContributionDto>(contribution);
            dto.IsContributionFromUser = contribution.UserId == userId;

            dto.Statistics = voting == null
                ? new ProductContributionStatistics {ApproveVotes = 0, TotalVotes = 0}
                : new ProductContributionStatistics {ApproveVotes = voting.ApproveVotes, TotalVotes = voting.ApproveVotes + voting.DisapproveVotes};

            if (vote != null)
                dto.Vote = new UserVoteDto {Approve = vote.Approve, CreatedOn = vote.CreatedOn};

            return dto;
        }
    }
}
