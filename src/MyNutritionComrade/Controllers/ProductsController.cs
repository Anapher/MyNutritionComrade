using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Extensions;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Extensions;
using MyNutritionComrade.Infrastructure.Helpers;
using MyNutritionComrade.Models.Paging;
using MyNutritionComrade.Models.Request;
using MyNutritionComrade.Models.Response;
using MyNutritionComrade.Selectors;

namespace MyNutritionComrade.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductsController : Controller
    {
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<SearchResult>>> SearchProduct([RequiredFromQuery] string barcode,
            [FromServices] IProductRepository repository, [FromServices] IMapper mapper)
        {
            if (string.IsNullOrEmpty(barcode))
                return new FieldValidationError("The query parameter barcode is required.", "query").ToActionResult();

            var product = await repository.FindByBarcode(barcode);
            if (product == null) return ImmutableList<SearchResult>.Empty;

            return new SearchResult[] {new ProductSuggestion(mapper.Map<ProductDto>(product))};
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<SearchResult>>> SearchProduct([RequiredFromQuery] string term, [FromQuery] SearchProductFilter filter,
            [FromServices] ISearchProductSelector searchProductSelector)
        {
            if (string.IsNullOrEmpty(term))
                return new FieldValidationError("The query parameter term is required.", "query").ToActionResult();

            var unitsArray = filter.Units?.Split(',');
            var consumables = filter.ConsumableFilter?.Split(',').Select(x => Enum.Parse<FoodPortionType>(x, true)).ToArray();

            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            return await searchProductSelector.SearchProducts(term, unitsArray, consumables, userId);
        }

        [HttpPost]
        public async Task<ActionResult<Product>> AddProduct(ProductInfo productInfo, [FromServices] IAddProductUseCase useCase)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            var response = await useCase.Handle(new AddProductRequest(productInfo, userId));
            if (useCase.HasError)
                return useCase.Error!.ToActionResult();

            return CreatedAtAction(nameof(GetProduct), new {id = response!.Product.Id}, response!.Product);
        }

        [HttpGet("{id}/contributions")]
        public async Task<ActionResult<ProductContributionDto>> GetContributions(string id, [FromQuery] PagingRequest request,
            [FromQuery] ProductContributionStatus? status, [FromServices] IQueryContributionsSelector selector)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;
            var pageResult = await selector.GetContributions(id, userId, status, request);

            return Ok(pageResult.MapToController(this, nameof(GetContributions), new { id, status }));
        }

        [HttpPost("contributions/{id}/vote")]
        public async Task<ActionResult<ProductContributionDto>> VoteForContribution(string id, [FromBody] bool approve,
            [FromServices] IVoteProductContributionUseCase useCase, [FromServices] IMapper mapper)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            var response = await useCase.Handle(new VoteProductContributionRequest(userId, id, approve));
            if (useCase.HasError)
                return useCase.ToActionResult();

            var dto = QueryContributionsSelector.MapToDto(response!.ProductContribution, response.Voting, response.Vote, userId, mapper);
            return Ok(dto);
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult> PatchProduct(string id, List<PatchOperation> operations, [FromServices] IPatchProductUseCase useCase)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            await useCase.Handle(new PatchProductRequest(id, operations, userId));
            if (useCase.HasError)
                return useCase.Error!.ToActionResult();

            return Ok();
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Product>> GetProduct(string id, [FromServices] IProductRepository repository, [FromServices] IMapper mapper)
        {
            var product = await repository.FindById(id);
            if (product == null)
                return new EntityNotFoundError("The product could not be found.", ErrorCode.Product_NotFound).ToActionResult();

            return Ok(mapper.Map<ProductDto>(product));
        }
    }
}
