using System.Collections.Generic;
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
        public async Task<ActionResult<IEnumerable<ProductSearchDto>>> SearchProduct([FromQuery] string search, [FromQuery] string? units, [FromServices] IElasticClient client, [FromServices] IMapper mapper)
        {
            var unitsArray = units?.Split(',');
            var response = await client.SearchAsync<ProductSearchEntry>(x => x.Size(8).Query(q =>
            {
                var q2 = q.QueryString(m => m.DefaultField(f => f.ProductName).Query($"*{search}*"));
                if (units?.Any() == true)
                    q2 = q2 && +q.Terms(t => t.Field(f => f.ServingTypes).Terms(unitsArray));

                return q2;
            }));

            return response.Documents.Select(mapper.Map<ProductSearchDto>).ToList();
        }

        [HttpPost]
        public async Task<ActionResult<Product>> AddProduct(ProductInfo productInfo, [FromServices] IAddOrUpdateProductUseCase useCase)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            var response = await useCase.Handle(new AddOrUpdateProductRequest(productInfo, null, null, userId));
            if (useCase.HasError)
                return useCase.Error!.ToActionResult();

            return CreatedAtAction(nameof(GetProduct), new {id = response!.Product.Id}, response!.Product);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Product>> UpdateProduct(string id, [FromQuery] int? version, ProductInfo productInfo, [FromServices] IAddOrUpdateProductUseCase useCase)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            var response = await useCase.Handle(new AddOrUpdateProductRequest(productInfo, id, version, userId));
            if (useCase.HasError)
                return useCase.Error!.ToActionResult();

            return Ok(response!.Product);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(string id, [FromServices] IProductRepository repository)
        {
            var product = await repository.FindById(id);
            if (product == null)
                return new EntityNotFoundError("The product could not be found.", ErrorCode.Product_NotFound).ToActionResult();

            return Ok(product);
        }
    }
}
