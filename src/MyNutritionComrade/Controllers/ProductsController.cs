using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Infrastructure.Elasticsearch;
using MyNutritionComrade.Infrastructure.Helpers;
using Nest;

namespace MyNutritionComrade.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class ProductsController : Controller
    {
        [AllowAnonymous]
        public async Task<ActionResult> SearchProduct([FromQuery] string search, [FromQuery] string units, [FromServices] IElasticClient client)
        {
            var unitsArray = units.Split(',');
            var response = await client.SearchAsync<ProductSearchEntry>(x => x.From(0).Size(8).Query(q =>
            {
                var q2 = q.Match(m => m.Field(f => f.ProductName).Query(search).Fuzziness(Fuzziness.Auto));
                if (units.Any())
                    q2 = q2 && +q.Terms(t => t.Field(f => f.ServingTypes).Terms(unitsArray));

                return q2;
            }));
            throw new NotImplementedException();
        }

        [HttpPost]
        public async Task<ActionResult> AddProduct(ProductDto productDto, [FromServices] IAddOrUpdateProductUseCase addOrUpdateProduct)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            await addOrUpdateProduct.Handle(new AddOrUpdateProductRequest(productDto, null, null, userId));
            return Ok();
        }
    }
}
