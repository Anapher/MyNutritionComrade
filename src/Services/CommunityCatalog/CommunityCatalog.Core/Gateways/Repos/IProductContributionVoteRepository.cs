using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;

namespace CommunityCatalog.Core.Gateways.Repos
{
    public interface IProductContributionVoteRepository
    {
        ValueTask Add(ProductContributionVote vote);
        ValueTask RemoveVote(string contributionId, string userId);
        ValueTask<ProductContributionVoting> GetVoting(string contributionId);
        ValueTask<ProductContributionVote?> FindVote(string contributionId, string userId);
    }

    public record ProductContributionVoting(int ApproveVotes, int DisapproveVotes);
}
