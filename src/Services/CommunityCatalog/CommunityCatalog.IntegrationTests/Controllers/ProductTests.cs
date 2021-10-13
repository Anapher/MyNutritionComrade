using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using CommunityCatalog.Core;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Errors;
using CommunityCatalog.Core.Response;
using CommunityCatalog.IntegrationTests._Helpers;
using CommunityCatalog.IntegrationTests.Extensions;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using MyNutritionComrade.Models;
using Xunit;
using Xunit.Abstractions;

namespace CommunityCatalog.IntegrationTests.Controllers
{
    [Collection(IntegrationTestCollection.Definition)]
    public class ProductTests : IntegrationTestBase
    {
        public ProductTests(ITestOutputHelper testOutputHelper, MongoDbFixture mongoDb) : base(testOutputHelper,
            mongoDb)
        {
        }

        [Fact]
        public async Task Create_NotAuthorized_UnauthorizedError()
        {
            // arrange
            var product = TestValues.TestProduct;

            // act
            var response = await Client.PostAsync("api/v1/Product", JsonNetContent.Create(product));

            // assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Create_ValidProduct_CreateProduct()
        {
            // arrange
            var product = TestValues.TestProduct;
            await Factory.LoginAndSetupClient(Client);

            // act
            await Api.CreateProduct(Client, product);
        }

        [Fact]
        public async Task Create_InvalidProduct_BadRequest()
        {
            // arrange
            var product = TestValues.TestProduct with
            {
                NutritionalInfo = TestValues.TestProduct.NutritionalInfo with { Energy = -1 },
            };

            await Factory.LoginAndSetupClient(Client);

            // act
            var ex = await Assert.ThrowsAsync<IdErrorException>(() => Api.CreateProduct(Client, product));

            // assert
            Assert.Equal(ex.Error.Code, ErrorCode.FieldValidation.ToString());
            Assert.All(ex.Error.Fields ?? ImmutableDictionary<string, string>.Empty,
                pair => { Assert.All(pair.Key.Split('.'), segment => Assert.True(char.IsLower(segment[0]))); });
        }

        [Fact]
        public async Task Create_TwoProductsWithEqualCode_SecondCreateFails()
        {
            var product = TestValues.TestProduct with { Code = "123" };

            // arrange
            await Factory.LoginAndSetupClient(Client);
            await Api.CreateProduct(Client, product);

            // act
            var ex = await Assert.ThrowsAnyAsync<IdErrorException>(async () =>
                await Api.CreateProduct(Client, product));
            Assert.Equal(NutritionComradeErrorCode.ProductCodeAlreadyExists.ToString(), ex.Error.Code);

            // assert
            var products = await Api.GetAllProducts(Client);
            var existingProduct = Assert.Single(products);

            AssertHelper.AssertObjectsEqualJson(product, existingProduct);
        }

        [Fact]
        public async Task GetIndexFile_NoProductsExist_ReturnNonEmptyUrlAndDateTimeMin()
        {
            // act
            var repositories = await Api.GetAllRepositories(Client);

            // assert
            var repository = Assert.Single(repositories);

            Assert.NotNull(repository.Url);
            Assert.Equal(DateTimeOffset.MinValue, repository.Timestamp);
        }

        [Fact]
        public async Task GetIndexFile_ProductExists_ReturnDateTimeGreaterThanMin()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            await Api.CreateProduct(Client, TestValues.TestProduct);

            // act
            var repositories = await Api.GetAllRepositories(Client);

            // assert
            var repository = Assert.Single(repositories);

            Assert.NotEqual(DateTimeOffset.MinValue, repository.Timestamp);
        }

        [Fact]
        public async Task GetAllProducts_NoProducts_ReturnEmptyProducts()
        {
            // act
            var products = await Api.GetAllProducts(Client);

            // assert
            Assert.Empty(products);
        }

        [Fact]
        public async Task GetProductContributions_NewProduct_SingleContribution()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            // act
            var contributions = await Api.GetProductContributions(Client, productId);

            // assert
            Assert.Single(contributions);
        }

        [Fact]
        public async Task PatchProduct_ProductDoesNotExist_BadRequest()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var patch = new JsonPatchDocument<ProductProperties>().Add(x => x.Code, "hello world");

            // act
            var ex = await Assert.ThrowsAsync<IdErrorException>(async () =>
                await Api.PatchProduct(Client, "123", patch.Operations));

            // assert
            AssertHelper.AssertErrorType(ex.Error, NutritionComradeErrorCode.ProductNotFound);
        }

        [Fact]
        public async Task PatchProduct_ProductExists_CreateContribution()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            var patch = new JsonPatchDocument<ProductProperties>().Add(x => x.Code, "hello world");

            // act
            await Api.PatchProduct(Client, productId, patch.Operations);

            // assert
            var contributions = await Api.GetProductContributions(Client, productId);
            Assert.Equal(2, contributions.Count);

            var contribution = contributions.Single(x => x.Status == ProductContributionStatus.Pending);
            Assert.True(contribution.CreatedByYou);
            Assert.Equal(productId, contribution.ProductId);
            Assert.Null(contribution.YourVote);
            Assert.Equal(new ProductContributionStatisticsDto(0, 0), contribution.Statistics);
            Assert.NotEmpty(contribution.Id);

            var op = Assert.Single(contribution.Operations);
            Assert.Equal("/Code", op.path);
            Assert.Equal("hello world", op.value);
            Assert.Equal(OperationType.Add, op.OperationType);
        }

        [Fact]
        public async Task PatchProduct_MultipleOperations_CreateContributions()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            var patch = new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                    JsonConfig.Default.ContractResolver).Add(x => x.Code, "hello world")
                .Add(x => x.NutritionalInfo.Protein, 11);

            // act
            var createdIds = await Api.PatchProduct(Client, productId, patch.Operations);

            // assert
            Assert.Equal(2, createdIds.Count);

            var contributions = await Api.GetProductContributions(Client, productId);
            Assert.Equal(3, contributions.Count);

            Assert.All(createdIds, s => Assert.Contains(contributions, x => x.Id == s));
        }

        [Fact]
        public async Task PatchProduct_CreateContributionTwice_ErrorOnSecondTry()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            var patch = new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                JsonConfig.Default.ContractResolver).Add(x => x.Code, "hello world");

            await Api.PatchProduct(Client, productId, patch.Operations);

            // act
            var ex = await Assert.ThrowsAsync<IdErrorException>(async () =>
                await Api.PatchProduct(Client, productId, patch.Operations));

            // assert
            AssertHelper.AssertErrorType(ex.Error, NutritionComradeErrorCode.ProductContributionCreatorCannotVote);
        }

        [Fact]
        public async Task VoteContribution_IsCreator_ErrorCannotVote()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            var patch = new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                JsonConfig.Default.ContractResolver).Add(x => x.Code, "hello world");

            var createdContributions = await Api.PatchProduct(Client, productId, patch.Operations);
            var contributionId = Assert.Single(createdContributions);

            // act
            var ex = await Assert.ThrowsAsync<IdErrorException>(() =>
                Api.VoteProductContribution(Client, productId, contributionId, true));

            // assert
            AssertHelper.AssertErrorType(ex.Error, NutritionComradeErrorCode.ProductContributionCreatorCannotVote);
        }

        [Fact]
        public async Task VoteContribution_IsOtherUser_AddVote()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            var patch = new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                JsonConfig.Default.ContractResolver).Add(x => x.Code, "hello world");

            var contributionId = Assert.Single(await Api.PatchProduct(Client, productId, patch.Operations));

            await Factory.LoginAndSetupClient(Client);

            // act
            await Api.VoteProductContribution(Client, productId, contributionId, true);

            // assert
            var contributions = await Api.GetProductContributions(Client, productId);
            var contribution = Assert.Single(contributions, x => x.Id == contributionId);
            Assert.True(contribution.YourVote?.Approve);
            Assert.Equal(new ProductContributionStatisticsDto(1, 1), contribution.Statistics);
        }

        [Fact]
        public async Task VoteContribution_EnoughVotes_ApplyAutomatically()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            var patch = new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                JsonConfig.Default.ContractResolver).Add(x => x.Code, "hello world");

            var contributionId = Assert.Single(await Api.PatchProduct(Client, productId, patch.Operations));

            // act
            for (var i = 0; i < 10; i++)
            {
                await Factory.LoginAndSetupClient(Client);
                await Api.VoteProductContribution(Client, productId, contributionId, true);
            }

            // assert
            var contributions = await Api.GetProductContributions(Client, productId);
            var contribution = Assert.Single(contributions, x => x.Id == contributionId);
            Assert.True(contribution.YourVote?.Approve);
            Assert.Equal(ProductContributionStatus.Applied, contribution.Status);

            var products = await Api.GetAllProducts(Client);
            var product = Assert.Single(products, x => x.Id == productId);
            Assert.Equal("hello world", product.Code);
        }

        [Fact]
        public async Task VoteContribution_EnoughDownVotes_RejectAutomatically()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            var patch = new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                JsonConfig.Default.ContractResolver).Add(x => x.Code, "hello world");

            var contributionId = Assert.Single(await Api.PatchProduct(Client, productId, patch.Operations));

            // act
            for (var i = 0; i < 10; i++)
            {
                await Factory.LoginAndSetupClient(Client);
                await Api.VoteProductContribution(Client, productId, contributionId, false);
            }

            // assert
            var contributions = await Api.GetProductContributions(Client, productId);
            var contribution = Assert.Single(contributions, x => x.Id == contributionId);
            Assert.Equal(ProductContributionStatus.Rejected, contribution.Status);
        }

        [Fact]
        public async Task VoteContribution_AlreadyApplied_BadRequest()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            var patch = new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                JsonConfig.Default.ContractResolver).Add(x => x.Code, "hello world");

            var contributionId = Assert.Single(await Api.PatchProduct(Client, productId, patch.Operations));
            for (var i = 0; i < 10; i++)
            {
                await Factory.LoginAndSetupClient(Client);
                await Api.VoteProductContribution(Client, productId, contributionId, true);
            }

            // act
            await Factory.LoginAndSetupClient(Client);
            var ex = await Assert.ThrowsAsync<IdErrorException>(() =>
                Api.VoteProductContribution(Client, productId, contributionId, true));

            // assert
            AssertHelper.AssertErrorType(ex.Error, NutritionComradeErrorCode.ProductContributionInvalidStatus);
        }

        [Fact]
        public async Task CreateContribution_IsAdmin_AutomaticallyApplyContribution()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client, true);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            var patch = new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                JsonConfig.Default.ContractResolver).Add(x => x.Code, "hello world");

            // act
            var contributionId = Assert.Single(await Api.PatchProduct(Client, productId, patch.Operations));

            // assert
            var contributions = await Api.GetProductContributions(Client, productId);
            var existingContribution = Assert.Single(contributions, x => x.Id == contributionId);
            Assert.Equal(ProductContributionStatus.Applied, existingContribution.Status);
        }

        [Fact]
        public async Task VoteContribution_ApproveAndIsAdmin_ImmediatelyApply()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            var patch = new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                JsonConfig.Default.ContractResolver).Add(x => x.Code, "hello world");

            var contributionId = Assert.Single(await Api.PatchProduct(Client, productId, patch.Operations));

            // act
            await Factory.LoginAndSetupClient(Client, true);
            await Api.VoteProductContribution(Client, productId, contributionId, true);

            // assert
            var contributions = await Api.GetProductContributions(Client, productId);
            var existingContribution = Assert.Single(contributions, x => x.Id == contributionId);
            Assert.Equal(ProductContributionStatus.Applied, existingContribution.Status);

            var products = await Api.GetAllProducts(Client);
            var product = Assert.Single(products, x => x.Id == productId);
            Assert.Equal("hello world", product.Code);
        }

        [Fact]
        public async Task VoteContribution_DisapproveAndIsAdmin_ImmediatelyReject()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            var patch = new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                JsonConfig.Default.ContractResolver).Add(x => x.Code, "hello world");

            var contributionId = Assert.Single(await Api.PatchProduct(Client, productId, patch.Operations));

            // act
            await Factory.LoginAndSetupClient(Client, true);
            await Api.VoteProductContribution(Client, productId, contributionId, false);

            // assert
            var contributions = await Api.GetProductContributions(Client, productId);
            var existingContribution = Assert.Single(contributions, x => x.Id == contributionId);
            Assert.Equal(ProductContributionStatus.Rejected, existingContribution.Status);
        }

        [Fact]
        public async Task ApplyContribution_InvalidContributionsExist_RejectInvalidContributions()
        {
            // arrange
            await Factory.LoginAndSetupClient(Client);
            var productId = await Api.CreateProduct(Client, TestValues.TestProduct);

            var patch = new JsonPatchDocument<ProductProperties>(new List<Operation<ProductProperties>>(),
                JsonConfig.Default.ContractResolver).Add(x => x.Code, "hello world");

            var contributionId = Assert.Single(await Api.PatchProduct(Client, productId, patch.Operations));
            for (var i = 0; i < 10; i++)
            {
                await Factory.LoginAndSetupClient(Client);
                await Api.VoteProductContribution(Client, productId, contributionId, true);
            }

            // act
            await Factory.LoginAndSetupClient(Client);
            var ex = await Assert.ThrowsAsync<IdErrorException>(() =>
                Api.VoteProductContribution(Client, productId, contributionId, true));

            // assert
            AssertHelper.AssertErrorType(ex.Error, NutritionComradeErrorCode.ProductContributionInvalidStatus);
        }
    }
}
