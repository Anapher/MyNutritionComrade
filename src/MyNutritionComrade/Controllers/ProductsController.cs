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
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Extensions;
using MyNutritionComrade.Infrastructure.Elasticsearch;
using MyNutritionComrade.Infrastructure.Extensions;
using MyNutritionComrade.Infrastructure.Helpers;
using MyNutritionComrade.Models.Response;
using Nest;

namespace MyNutritionComrade.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductsController : Controller
    {
        [AllowAnonymous]
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ProductSearchDto>>> SearchProduct([FromQuery] string? term, [FromQuery] string? barcode,
            [FromQuery] string? units, [FromServices] IElasticClient client, [FromServices] IProductRepository repository, [FromServices] IMapper mapper)
        {
            if (!string.IsNullOrEmpty(barcode))
            {
                var product = await repository.FindByBarcode(barcode);
                if (product == null) return ImmutableList<ProductSearchDto>.Empty;

                return mapper.Map<ProductSearchDto>(product).Yield().ToList();
            }

            if (string.IsNullOrEmpty(term))
                return new FieldValidationError("The query parameter term or barcode is required.", "query").ToActionResult();

            var unitsArray = units?.Split(',');
            var response = await client.SearchAsync<ProductSearchEntry>(x => x.Size(8).Query(q =>
            {
                var q2 = q.QueryString(m => m.DefaultField(f => f.ProductName).Query($"*{term}*"));
                if (units?.Any() == true)
                    q2 = q2 && +q.Terms(t => t.Field(f => f.ServingTypes).Terms(unitsArray));

                return q2;
            }));

            return response.Documents.Select(mapper.Map<ProductSearchDto>).ToList();
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

        [HttpPatch("{id}")]
        public async Task<ActionResult<Product>> PatchProduct(string id, [FromQuery] int? version, List<PatchOperation> operations, [FromServices] IAddProductUseCase useCase)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            throw new NotImplementedException();
            //var response = await useCase.Handle(new AddProductRequest());
            //if (useCase.HasError)
            //    return useCase.Error!.ToActionResult();

            //return Ok(response!.Product);
        }

        [HttpGet("{id}"), AllowAnonymous]
        public async Task<ActionResult<Product>> GetProduct(string id, [FromServices] IProductRepository repository, [FromServices] IMapper mapper)
        {
            var product = await repository.FindById(id);
            if (product == null)
                return new EntityNotFoundError("The product could not be found.", ErrorCode.Product_NotFound).ToActionResult();

            return Ok(mapper.Map<ProductDto>(product));
        }
    }
}
