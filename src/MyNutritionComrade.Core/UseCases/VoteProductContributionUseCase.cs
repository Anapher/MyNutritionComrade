using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Core.Options;

namespace MyNutritionComrade.Core.UseCases
{
    public class VoteProductContributionUseCase : UseCaseStatus<VoteProductContributionResponse>, IVoteProductContributionUseCase
    {
        private readonly IUserRepository _userRepository;
        private readonly IProductContributionVoteRepository _voteRepository;
        private readonly IProductContributionRepository _contributionRepository;
        private readonly IProductRepository _productRepository;
        private readonly VotingOptions _options;
        private readonly IApplyProductContributionUseCase _applyProductContributionUseCase;
        private readonly ILogger<VoteProductContributionUseCase> _logger;

        public VoteProductContributionUseCase(IUserRepository userRepository, IProductContributionVoteRepository voteRepository,
            IProductContributionRepository contributionRepository, IProductRepository productRepository, IOptions<VotingOptions> options,
            IApplyProductContributionUseCase applyProductContributionUseCase, ILogger<VoteProductContributionUseCase> logger)
        {
            _userRepository = userRepository;
            _voteRepository = voteRepository;
            _contributionRepository = contributionRepository;
            _productRepository = productRepository;
            _options = options.Value;
            _applyProductContributionUseCase = applyProductContributionUseCase;
            _logger = logger;
        }

        public async Task<VoteProductContributionResponse?> Handle(VoteProductContributionRequest message)
        {
            var user = await _userRepository.FindById(message.UserId);
            if (user == null)
                return ReturnError(new EntityNotFoundError($"The user with id {message.UserId} was not found.", ErrorCode.UserNotFound));

            var contribution = await _contributionRepository.FindById(message.ProductContributionId);
            if (contribution == null)
                return ReturnError(new EntityNotFoundError("The product contribution was not found.", ErrorCode.ProductContribution_NotFound));

            if (contribution.Status != ProductContributionStatus.Pending)
                return ReturnError(new InvalidOperationError(
                    $"The status of the contribution must be {ProductContributionStatus.Pending}, but it is {contribution.Status}",
                    ErrorCode.ProductContribution_InvalidStatus));

            if (contribution.UserId == user.Id)
                return ReturnError(new InvalidOperationError("The user is the creator of this contribution.", ErrorCode.ProductContribution_UserIsCreator));

            var vote = new ProductContributionVote(user.Id, contribution.Id, message.Approve);
            if (!await _voteRepository.AddVote(vote))
                return ReturnError(new InvalidOperationError("The user already voted for this contribution.", ErrorCode.ProductContribution_AlreadyVoted));

            var voting = await _voteRepository.GetVoting(contribution.Id);
            var totalVotes = voting.ApproveVotes + voting.DisapproveVotes;
            var proportion = voting.ApproveVotes / (double) totalVotes;
            var apply = message.Approve;

            if (!user.IsTrustworthy)
            {
                if (totalVotes < _options.MinVotesRequired)
                    return new VoteProductContributionResponse(contribution, vote, voting);

                if (1 - proportion < _options.EffectProportionMargin)
                    apply = true;
                else if (proportion < _options.EffectProportionMargin)
                    apply = false;
                else
                    return new VoteProductContributionResponse(contribution, vote, voting);
            }

            var statistics = $"votes: {totalVotes}, approvement percentage: {proportion:P}";
            if (!await ExecuteOperation(contribution, apply, statistics))
            {
                // the operation failed, we revert the vote
                await _voteRepository.RemoveVote(vote);
                return null;
            }

            return new VoteProductContributionResponse(contribution, vote, voting);
        }

        private async Task<bool> ExecuteOperation(ProductContribution contribution, bool apply, string descriptionStatistics)
        {
            if (apply)
            {
                // apply contribution on product
                var product = await _productRepository.FindById(contribution.ProductId);
                if (product == null)
                {
                    _logger.LogError("The product contribution {productContributionId} relates to a product {productId} that does not exist. That must not happen.",
                        contribution.Id, contribution.ProductId);
                    SetError(new InternalError($"The product with id {contribution.ProductId} was not found.", ErrorCode.Product_NotFound));
                    return false;
                }

                await _applyProductContributionUseCase.Handle(new ApplyProductContributionRequest(contribution, product,
                    $"Automatically applied ({descriptionStatistics})"));
                if (_applyProductContributionUseCase.HasError)
                {
                    SetError(_applyProductContributionUseCase.Error!);
                    return false;
                }
            }
            else
            {
                // reject contribution
                contribution.Reject($"Automatically rejected ({descriptionStatistics})");
                if (!await _contributionRepository.UpdateProductContribution(contribution))
                {
                    SetError(new RaceConditionError("Cannot update product contribution", ErrorCode.ProductContribution_UpdatedFailed));
                    return false;
                }
            }

            return true;
        }
    }
}
