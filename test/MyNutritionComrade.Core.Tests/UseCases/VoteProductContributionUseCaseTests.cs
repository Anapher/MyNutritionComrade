using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Moq;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Domain.Entities.Account;
using MyNutritionComrade.Core.Dto;
using MyNutritionComrade.Core.Dto.GatewayResponses.Repositories;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Core.Options;
using MyNutritionComrade.Core.Tests._Helpers;
using MyNutritionComrade.Core.UseCases;
using Newtonsoft.Json.Linq;
using Xunit;

namespace MyNutritionComrade.Core.Tests.UseCases
{
    public class VoteProductContributionUseCaseTests
    {
        protected readonly Mock<IUserRepository> UserRepo = new Mock<IUserRepository>();
        protected readonly Mock<IProductContributionVoteRepository> VoteRepo = new Mock<IProductContributionVoteRepository>();
        protected readonly Mock<IProductContributionRepository> ContributionRepo = new Mock<IProductContributionRepository>();
        protected readonly Mock<IProductRepository> ProductRepo = new Mock<IProductRepository>();

        protected readonly IOptions<VotingOptions> VotingOptions =
            new OptionsWrapper<VotingOptions>(new VotingOptions { MinVotesRequired = 5, EffectProportionMargin = 0.2 });

        protected readonly Mock<IApplyProductContributionUseCase> ApplyContributionUseCase = new Mock<IApplyProductContributionUseCase>();
        protected readonly ILogger<VoteProductContributionUseCase> Logger = new NullLogger<VoteProductContributionUseCase>();

        private string HasValidUser(bool isTrustworthy = false)
        {
            var userId = "123";
            var user = UserHelper.Default(userId);
            user.IsTrustworthy = isTrustworthy;

            UserRepo.Setup(x => x.FindById("123")).ReturnsAsync(user);

            return userId;
        }

        private string HasValidProduct()
        {
            var productId = "ABC";
            ProductRepo.Setup(x => x.FindById(productId)).ReturnsAsync(new Product(productId));
            return productId;
        }

        private void CanApplyContribution(string productId, string contributionId, bool writeChanges, bool success)
        {
            ApplyContributionUseCase.Setup(x => x.Handle(It.IsAny<ApplyProductContributionRequest>()))
                .Callback((ApplyProductContributionRequest request) =>
                {
                    Assert.Equal(contributionId, request.Contribution.Id);
                    Assert.Equal(productId, request.Product.Id);
                    Assert.Equal(writeChanges, request.WriteChanges);
                    Assert.NotEmpty(request.Description);
                }).ReturnsAsync((ApplyProductContributionRequest request) =>
                    new ApplyProductContributionResponse(request.Contribution, request.Product));


            ApplyContributionUseCase.SetupGet(x => x.HasError).Returns(!success);
            if (!success)
                ApplyContributionUseCase.SetupGet(x => x.Error).Returns(new Error("test", "test", -1));
        }

        private string HasValidContribution(string productId, string userId = "65")
        {
            var contributionId = "75";
            var contribution = new ProductContribution(userId, productId, new List<PatchOperation> { new OpSetProperty("code", JToken.FromObject("123456")) });
            contribution.GetType().GetProperty("Id").SetValue(contribution, contributionId);

            ContributionRepo.Setup(x => x.FindById(contributionId)).ReturnsAsync(contribution);

            return contributionId;
        }

        private void UserCanVote(string userId, string contributionId, bool approve, bool success)
        {
            VoteRepo.Setup(x => x.AddVote(It.IsAny<ProductContributionVote>())).Callback((ProductContributionVote vote) =>
            {
                Assert.Equal(userId, vote.UserId);
                Assert.Equal(contributionId, vote.ProductContributionId);
                Assert.Equal(approve, vote.Approve);
            }).ReturnsAsync(success);
        }

        private void ContributionHasVoting(string contributionId, int approve, int disapprove)
        {
            VoteRepo.Setup(x => x.GetVoting(contributionId))
                .ReturnsAsync(new ProductContributionVoting { ProductContributionId = contributionId, ApproveVotes = approve, DisapproveVotes = disapprove });
        }

        [Fact]
        public async Task TestUserNotFound()
        {
            // arrange
            var useCase = new VoteProductContributionUseCase(UserRepo.Object, VoteRepo.Object, ContributionRepo.Object, ProductRepo.Object, VotingOptions,
                ApplyContributionUseCase.Object, Logger);

            UserRepo.Setup(x => x.FindById("123")).ReturnsAsync((User)null);

            // act
            await useCase.Handle(new VoteProductContributionRequest("123", "1", true));

            // assert
            Assert.True(useCase.HasError);
            Assert.Equal(ErrorCode.UserNotFound, (ErrorCode)useCase.Error.Code);

            VoteRepo.VerifyNoOtherCalls();
            ContributionRepo.VerifyNoOtherCalls();
            ProductRepo.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestContributionDoesntExist()
        {
            // arrange
            var useCase = new VoteProductContributionUseCase(UserRepo.Object, VoteRepo.Object, ContributionRepo.Object, ProductRepo.Object, VotingOptions,
                ApplyContributionUseCase.Object, Logger);

            var userId = HasValidUser();
            ContributionRepo.Setup(x => x.FindById("1")).ReturnsAsync((ProductContribution)null);

            // act
            await useCase.Handle(new VoteProductContributionRequest(userId, "1", true));

            // assert
            Assert.True(useCase.HasError);
            Assert.Equal(ErrorCode.ProductContribution_NotFound, (ErrorCode)useCase.Error.Code);

            ContributionRepo.Verify(x => x.FindById("1"), Times.Once);
            VoteRepo.VerifyNoOtherCalls();
            ContributionRepo.VerifyNoOtherCalls();
            ProductRepo.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestContributionAlreadyApplied()
        {
            // arrange
            var useCase = new VoteProductContributionUseCase(UserRepo.Object, VoteRepo.Object, ContributionRepo.Object, ProductRepo.Object, VotingOptions,
                ApplyContributionUseCase.Object, Logger);

            var userId = HasValidUser();
            var contribution = new ProductContribution("12", "5", new List<PatchOperation> { new OpSetProperty("defaultServing", JToken.FromObject("piece")) });
            contribution.Apply(5);

            ContributionRepo.Setup(x => x.FindById("1")).ReturnsAsync(contribution);

            // act
            await useCase.Handle(new VoteProductContributionRequest(userId, "1", true));

            // assert
            Assert.True(useCase.HasError);
            Assert.Equal(ErrorCode.ProductContribution_InvalidStatus, (ErrorCode)useCase.Error.Code);

            ContributionRepo.Verify(x => x.FindById("1"), Times.Once);
            VoteRepo.VerifyNoOtherCalls();
            ContributionRepo.VerifyNoOtherCalls();
            ProductRepo.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestContributionRejected()
        {
            // arrange
            var useCase = new VoteProductContributionUseCase(UserRepo.Object, VoteRepo.Object, ContributionRepo.Object, ProductRepo.Object, VotingOptions,
                ApplyContributionUseCase.Object, Logger);

            var userId = HasValidUser();
            var contribution = new ProductContribution("12", "5", new List<PatchOperation> { new OpSetProperty("defaultServing", JToken.FromObject("piece")) });
            contribution.Reject();

            ContributionRepo.Setup(x => x.FindById("1")).ReturnsAsync(contribution);

            // act
            await useCase.Handle(new VoteProductContributionRequest(userId, "1", true));

            // assert
            Assert.True(useCase.HasError);
            Assert.Equal(ErrorCode.ProductContribution_InvalidStatus, (ErrorCode)useCase.Error.Code);

            ContributionRepo.Verify(x => x.FindById("1"), Times.Once);
            VoteRepo.VerifyNoOtherCalls();
            ContributionRepo.VerifyNoOtherCalls();
            ProductRepo.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestCannotVoteOnOwnContribution()
        {
            // arrange
            var useCase = new VoteProductContributionUseCase(UserRepo.Object, VoteRepo.Object, ContributionRepo.Object, ProductRepo.Object, VotingOptions,
                ApplyContributionUseCase.Object, Logger);

            var userId = HasValidUser();
            var contributionId = HasValidContribution("5", userId);

            // act
            await useCase.Handle(new VoteProductContributionRequest(userId, contributionId, true));

            // assert
            Assert.True(useCase.HasError);
            Assert.Equal(ErrorCode.ProductContribution_UserIsCreator, (ErrorCode)useCase.Error.Code);

            ContributionRepo.Verify(x => x.FindById(contributionId), Times.Once);
            VoteRepo.VerifyNoOtherCalls();
            ContributionRepo.VerifyNoOtherCalls();
            ProductRepo.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestUserAlreadyVoted()
        {
            // arrange
            var useCase = new VoteProductContributionUseCase(UserRepo.Object, VoteRepo.Object, ContributionRepo.Object, ProductRepo.Object, VotingOptions,
                ApplyContributionUseCase.Object, Logger);

            var userId = HasValidUser();
            var contributionId = HasValidContribution("5", "54");

            UserCanVote(userId, contributionId, true, false);

            // act
            await useCase.Handle(new VoteProductContributionRequest(userId, contributionId, true));

            // assert
            Assert.True(useCase.HasError);
            Assert.Equal(ErrorCode.ProductContribution_AlreadyVoted, (ErrorCode)useCase.Error.Code);

            ContributionRepo.Verify(x => x.FindById(contributionId), Times.Once);
            VoteRepo.Verify(x => x.AddVote(It.IsAny<ProductContributionVote>()), Times.Once);

            VoteRepo.VerifyNoOtherCalls();
            ContributionRepo.VerifyNoOtherCalls();
            ProductRepo.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestUserTrustworthyApplyContribution()
        {
            // arrange
            var useCase = new VoteProductContributionUseCase(UserRepo.Object, VoteRepo.Object, ContributionRepo.Object, ProductRepo.Object, VotingOptions,
                ApplyContributionUseCase.Object, Logger);

            var userId = HasValidUser(true);
            var productId = HasValidProduct();
            var contributionId = HasValidContribution(productId, "54");

            UserCanVote(userId, contributionId, true, true);
            ContributionHasVoting(contributionId, 0, 0);
            CanApplyContribution(productId, contributionId, true, true);

            // act
            await useCase.Handle(new VoteProductContributionRequest(userId, contributionId, true));

            // assert
            Assert.False(useCase.HasError);

            ContributionRepo.Verify(x => x.FindById(contributionId), Times.Once);
            VoteRepo.Verify(x => x.AddVote(It.IsAny<ProductContributionVote>()), Times.Once);
            VoteRepo.Verify(x => x.GetVoting(contributionId), Times.Once);
            ProductRepo.Verify(x => x.FindById(productId), Times.Once);
            ApplyContributionUseCase.Verify(x => x.Handle(It.IsAny<ApplyProductContributionRequest>()), Times.Once);

            VoteRepo.VerifyNoOtherCalls();
            ContributionRepo.VerifyNoOtherCalls();
            ProductRepo.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestUserTrustworthyApplyContributionError()
        {
            // arrange
            var useCase = new VoteProductContributionUseCase(UserRepo.Object, VoteRepo.Object, ContributionRepo.Object, ProductRepo.Object, VotingOptions,
                ApplyContributionUseCase.Object, Logger);

            var userId = HasValidUser(true);
            var productId = HasValidProduct();
            var contributionId = HasValidContribution(productId, "54");

            UserCanVote(userId, contributionId, true, true);
            ContributionHasVoting(contributionId, 0, 0);
            CanApplyContribution(productId, contributionId, true, false);

            // act
            await useCase.Handle(new VoteProductContributionRequest(userId, contributionId, true));

            // assert
            Assert.True(useCase.HasError);

            ContributionRepo.Verify(x => x.FindById(contributionId), Times.Once);
            VoteRepo.Verify(x => x.AddVote(It.IsAny<ProductContributionVote>()), Times.Once);
            VoteRepo.Verify(x => x.GetVoting(contributionId), Times.Once);
            VoteRepo.Verify(x => x.RemoveVote(It.IsAny<ProductContributionVote>()), Times.Once);
            ProductRepo.Verify(x => x.FindById(productId), Times.Once);
            ApplyContributionUseCase.Verify(x => x.Handle(It.IsAny<ApplyProductContributionRequest>()), Times.Once);

            VoteRepo.VerifyNoOtherCalls();
            ContributionRepo.VerifyNoOtherCalls();
            ProductRepo.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestUserTrustworthyRejectContribution()
        {
            // arrange
            var useCase = new VoteProductContributionUseCase(UserRepo.Object, VoteRepo.Object, ContributionRepo.Object, ProductRepo.Object, VotingOptions,
                ApplyContributionUseCase.Object, Logger);

            var userId = HasValidUser(true);
            var productId = HasValidProduct();
            var contributionId = HasValidContribution(productId, "54");

            UserCanVote(userId, contributionId, false, true);
            ContributionHasVoting(contributionId, 0, 0);

            ContributionRepo.Setup(x => x.UpdateProductContribution(It.IsAny<ProductContribution>())).ReturnsAsync(true);

            // act
            await useCase.Handle(new VoteProductContributionRequest(userId, contributionId, false));

            // assert
            Assert.False(useCase.HasError);

            ContributionRepo.Verify(x => x.FindById(contributionId), Times.Once);
            VoteRepo.Verify(x => x.AddVote(It.IsAny<ProductContributionVote>()), Times.Once);
            VoteRepo.Verify(x => x.GetVoting(contributionId), Times.Once);
            ContributionRepo.Verify(x => x.UpdateProductContribution(It.IsAny<ProductContribution>()), Times.Once);

            VoteRepo.VerifyNoOtherCalls();
            ContributionRepo.VerifyNoOtherCalls();
            ProductRepo.VerifyNoOtherCalls();
            ApplyContributionUseCase.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestUserTrustworthyRejectContributionError()
        {
            // arrange
            var useCase = new VoteProductContributionUseCase(UserRepo.Object, VoteRepo.Object, ContributionRepo.Object, ProductRepo.Object, VotingOptions,
                ApplyContributionUseCase.Object, Logger);

            var userId = HasValidUser(true);
            var productId = HasValidProduct();
            var contributionId = HasValidContribution(productId, "54");

            UserCanVote(userId, contributionId, false, true);
            ContributionHasVoting(contributionId, 0, 0);

            ContributionRepo.Setup(x => x.UpdateProductContribution(It.IsAny<ProductContribution>())).ReturnsAsync(false);

            // act
            await useCase.Handle(new VoteProductContributionRequest(userId, contributionId, false));

            // assert
            Assert.True(useCase.HasError);

            ContributionRepo.Verify(x => x.FindById(contributionId), Times.Once);
            VoteRepo.Verify(x => x.AddVote(It.IsAny<ProductContributionVote>()), Times.Once);
            VoteRepo.Verify(x => x.GetVoting(contributionId), Times.Once);
            VoteRepo.Verify(x => x.RemoveVote(It.IsAny<ProductContributionVote>()), Times.Once);
            ContributionRepo.Verify(x => x.UpdateProductContribution(It.IsAny<ProductContribution>()), Times.Once);

            VoteRepo.VerifyNoOtherCalls();
            ContributionRepo.VerifyNoOtherCalls();
            ProductRepo.VerifyNoOtherCalls();
            ApplyContributionUseCase.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestVotingCompletedApplyContribution()
        {
            // arrange
            var useCase = new VoteProductContributionUseCase(UserRepo.Object, VoteRepo.Object, ContributionRepo.Object, ProductRepo.Object, VotingOptions,
                ApplyContributionUseCase.Object, Logger);

            var userId = HasValidUser(false);
            var productId = HasValidProduct();
            var contributionId = HasValidContribution(productId, "54");

            UserCanVote(userId, contributionId, true, true);
            ContributionHasVoting(contributionId, 5, 0);
            CanApplyContribution(productId, contributionId, true, true);

            // act
            await useCase.Handle(new VoteProductContributionRequest(userId, contributionId, true));

            // assert
            Assert.False(useCase.HasError);

            ContributionRepo.Verify(x => x.FindById(contributionId), Times.Once);
            VoteRepo.Verify(x => x.AddVote(It.IsAny<ProductContributionVote>()), Times.Once);
            VoteRepo.Verify(x => x.GetVoting(contributionId), Times.Once);
            ApplyContributionUseCase.Verify(x => x.Handle(It.IsAny<ApplyProductContributionRequest>()), Times.Once);
            ProductRepo.Verify(x => x.FindById(productId), Times.Once);

            VoteRepo.VerifyNoOtherCalls();
            ContributionRepo.VerifyNoOtherCalls();
            ProductRepo.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestVotingCompletedRejectContribution()
        {
            // arrange
            var useCase = new VoteProductContributionUseCase(UserRepo.Object, VoteRepo.Object, ContributionRepo.Object, ProductRepo.Object, VotingOptions,
                ApplyContributionUseCase.Object, Logger);

            var userId = HasValidUser(false);
            var productId = HasValidProduct();
            var contributionId = HasValidContribution(productId, "54");

            UserCanVote(userId, contributionId, true, true);
            ContributionHasVoting(contributionId, 1, 9);
            ContributionRepo.Setup(x => x.UpdateProductContribution(It.IsAny<ProductContribution>())).ReturnsAsync(true);

            // act
            await useCase.Handle(new VoteProductContributionRequest(userId, contributionId, true));

            // assert
            Assert.False(useCase.HasError);

            ContributionRepo.Verify(x => x.FindById(contributionId), Times.Once);
            VoteRepo.Verify(x => x.AddVote(It.IsAny<ProductContributionVote>()), Times.Once);
            VoteRepo.Verify(x => x.GetVoting(contributionId), Times.Once);
            ContributionRepo.Verify(x => x.UpdateProductContribution(It.IsAny<ProductContribution>()), Times.Once);

            VoteRepo.VerifyNoOtherCalls();
            ContributionRepo.VerifyNoOtherCalls();
            ProductRepo.VerifyNoOtherCalls();
            ApplyContributionUseCase.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestVoteAgainstNothingChanged()
        {
            // arrange
            var useCase = new VoteProductContributionUseCase(UserRepo.Object, VoteRepo.Object, ContributionRepo.Object, ProductRepo.Object, VotingOptions,
                ApplyContributionUseCase.Object, Logger);

            var userId = HasValidUser(false);
            var productId = HasValidProduct();
            var contributionId = HasValidContribution(productId, "54");

            UserCanVote(userId, contributionId, false, true);
            ContributionHasVoting(contributionId, 2, 3);

            // act
            await useCase.Handle(new VoteProductContributionRequest(userId, contributionId, false));

            // assert
            Assert.False(useCase.HasError);

            ContributionRepo.Verify(x => x.FindById(contributionId), Times.Once);
            VoteRepo.Verify(x => x.AddVote(It.IsAny<ProductContributionVote>()), Times.Once);
            VoteRepo.Verify(x => x.GetVoting(contributionId), Times.Once);
            ApplyContributionUseCase.Verify(x => x.Handle(It.IsAny<ApplyProductContributionRequest>()), Times.Never);

            VoteRepo.VerifyNoOtherCalls();
            ContributionRepo.VerifyNoOtherCalls();
            ProductRepo.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestVoteApproveNothingChanged()
        {
            // arrange
            var useCase = new VoteProductContributionUseCase(UserRepo.Object, VoteRepo.Object, ContributionRepo.Object, ProductRepo.Object, VotingOptions,
                ApplyContributionUseCase.Object, Logger);

            var userId = HasValidUser(false);
            var productId = HasValidProduct();
            var contributionId = HasValidContribution(productId, "54");

            UserCanVote(userId, contributionId, true, true);
            ContributionHasVoting(contributionId, 3, 2);

            // act
            await useCase.Handle(new VoteProductContributionRequest(userId, contributionId, true));

            // assert
            Assert.False(useCase.HasError);

            ContributionRepo.Verify(x => x.FindById(contributionId), Times.Once);
            VoteRepo.Verify(x => x.AddVote(It.IsAny<ProductContributionVote>()), Times.Once);
            VoteRepo.Verify(x => x.GetVoting(contributionId), Times.Once);
            ApplyContributionUseCase.Verify(x => x.Handle(It.IsAny<ApplyProductContributionRequest>()), Times.Never);

            VoteRepo.VerifyNoOtherCalls();
            ContributionRepo.VerifyNoOtherCalls();
            ProductRepo.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task TestNotEnoughVotes()
        {
            // arrange
            var useCase = new VoteProductContributionUseCase(UserRepo.Object, VoteRepo.Object, ContributionRepo.Object, ProductRepo.Object, VotingOptions,
                ApplyContributionUseCase.Object, Logger);

            var userId = HasValidUser(false);
            var productId = HasValidProduct();
            var contributionId = HasValidContribution(productId, "54");

            UserCanVote(userId, contributionId, true, true);
            ContributionHasVoting(contributionId, 2, 0);

            // act
            await useCase.Handle(new VoteProductContributionRequest(userId, contributionId, true));

            // assert
            Assert.False(useCase.HasError);

            ContributionRepo.Verify(x => x.FindById(contributionId), Times.Once);
            VoteRepo.Verify(x => x.AddVote(It.IsAny<ProductContributionVote>()), Times.Once);
            VoteRepo.Verify(x => x.GetVoting(contributionId), Times.Once);
            ApplyContributionUseCase.Verify(x => x.Handle(It.IsAny<ApplyProductContributionRequest>()), Times.Never);

            VoteRepo.VerifyNoOtherCalls();
            ContributionRepo.VerifyNoOtherCalls();
            ProductRepo.VerifyNoOtherCalls();
        }
    }
}
