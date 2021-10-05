using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CommunityCatalog.Core.Gateways.Repos;
using CommunityCatalog.Core.Requests;
using CommunityCatalog.Extensions;
using CommunityCatalog.Models.Response;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyNutritionComrade.Models;
using MyNutritionComrade.Models.Index;

namespace CommunityCatalog.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ProductController : Controller
    {
        private readonly IMediator _mediator;

        public ProductController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> CreateProduct([FromBody] ProductProperties dto)
        {
            try
            {
                var userId = User.GetUserId();
                var result = await _mediator.Send(new CreateProductRequest(userId, dto));
                return Ok(new ProductCreatedDto(result.Id));
            }
            catch (Exception e)
            {
                return e.ToError().ToActionResult();
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IReadOnlyList<Product>>> GetAllProducts(
            [FromServices] IProductRepository repository)
        {
            return Ok(await repository.GetAll());
        }

        [HttpGet("index.json")]
        [AllowAnonymous]
        public async Task<ActionResult<IReadOnlyList<RepositoryReference>>> GetIndexFile(
            [FromServices] IProductRepository repository)
        {
            var productsUrl = Url.ActionLink(nameof(GetAllProducts));

            var latestChange = await repository.GetLatestProductChange();

            return Ok(new List<RepositoryReference> { new(productsUrl, latestChange ?? DateTimeOffset.MinValue) });
        }
    }
}
