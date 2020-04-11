using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.GatewayResponses.Repositories;
using MyNutritionComrade.Extensions;
using MyNutritionComrade.Infrastructure.Data.Indexes;
using MyNutritionComrade.Models.Paging;
using MyNutritionComrade.Models.Response;
using Raven.Client.Documents;
using Raven.Client.Documents.Linq;
using Raven.Client.Documents.Session;

namespace MyNutritionComrade.Selectors
{
    public interface IQueryContributionsSelector : IDataSelector
    {
        Task<PagingInternalResponse<ProductContributionDto>> GetContributions(string productId, string userId, ProductContributionStatus? status,
            PagingRequest request);
    }

    public class QueryContributionsSelector : IQueryContributionsSelector
    {
        private readonly IMapper _mapper;
        private readonly IAsyncDocumentSession _session;
        private const SortDirection DefaultSortDir = SortDirection.Descending;

        public QueryContributionsSelector(IAsyncDocumentSession session, IMapper mapper)
        {
            _session = session;
            _mapper = mapper;
        }

        public async Task<PagingInternalResponse<ProductContributionDto>> GetContributions(string productId, string userId, ProductContributionStatus? status,
            PagingRequest request)
        {
            var query = _session.Query<ProductContribution, ProductContribution_ByProductAndStatus>().Where(x => x.ProductId == productId);
            if (status != null)
                query = query.Where(x => x.Status == status);

            var count = await query.CountAsync();

            var contributions = await query.ToPageByDateTimeAsync(request, x => x.CreatedOn, DefaultSortDir);
            var contributionIds = contributions.Select(x => x.Id).ToList();

            var voting = await _session.Query<ProductContributionVoting, ProductContributionVote_ByProductContribution>()
                .Where(x => x.ProductContributionId.In(contributionIds)).ToListAsync();

            var votes = await _session.Query<ProductContributionVote, ProductContributionVote_ByUserAndContribution>()
                .Where(x => x.UserId == userId && x.ProductContributionId.In(contributionIds)).ToListAsync();

            var result = new List<ProductContributionDto>();
            foreach (var contribution in contributions)
                result.Add(MapToDto(contribution, voting.FirstOrDefault(x => x.ProductContributionId == contribution.Id),
                    votes.FirstOrDefault(x => x.ProductContributionId == contribution.Id), userId, _mapper));

            var links = PagingExtensions.CreateLinks(result, x => x.CreatedOn, request.SortDirection ?? DefaultSortDir);
            return new PagingInternalResponse<ProductContributionDto>(links, new PagingMetadata(count), result);
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
