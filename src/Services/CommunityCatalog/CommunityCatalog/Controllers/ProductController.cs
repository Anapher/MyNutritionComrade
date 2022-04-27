using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CommunityCatalog.Core;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Extensions;
using CommunityCatalog.Core.Gateways.Repos;
using CommunityCatalog.Core.Requests;
using CommunityCatalog.Core.Response;
using CommunityCatalog.Core.Services;
using CommunityCatalog.Extensions;
using CommunityCatalog.Models.Request;
using CommunityCatalog.Models.Response;
using CommunityCatalog.Selectors;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch.Operations;
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
        private readonly IProductRepository _productRepository;

        public ProductController(IMediator mediator, IProductRepository productRepository)
        {
            _mediator = mediator;
            _productRepository = productRepository;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> CreateProduct([FromBody] ProductProperties dto)
        {
            var userId = User.GetUserId();
            var result = await _mediator.Send(new CreateProductRequest(userId, dto));
            return Ok(new ProductCreatedDto(result.Id));
        }

        [HttpPatch("{productId}/preview")]
        [AllowAnonymous]
        public async Task<ActionResult<IReadOnlyList<ProductOperationsGroup>>> PreviewPatchProduct(
            [FromBody] IReadOnlyList<Operation> operations, string productId)
        {
            await EnsureProductWritable(productId);

            var result =
                    await _mediator.Send(new ValidateAndGroupProductContributionsRequest(productId, operations));
            return Ok(result);
        }

        [HttpPatch("{productId}")]
        [Authorize]
        public async Task<ActionResult<IReadOnlyList<string>>> PatchProduct(
            [FromBody] IReadOnlyList<Operation> operations, string productId)
        {
            await EnsureProductWritable(productId);

            var userId = User.GetUserId();
            var admin = User.IsAdmin();

            var groups = await _mediator.Send(new ValidateAndGroupProductContributionsRequest(productId, operations));

            var result = new List<string>();
            foreach (var operationsGroup in groups)
            {
                var contributionId = await _mediator.Send(
                    new CreateProductContributionRequest(userId, productId, operationsGroup));

                if (admin)
                {
                    await _mediator.Send(new ApplyProductContributionRequest(contributionId,
                        "Applied on creation because user is admin"));
                }

                result.Add(contributionId);
            }

            return Ok(result);
        }

        [HttpGet("{productId}/contributions")]
        [AllowAnonymous]
        public async Task<ActionResult<IReadOnlyList<ProductContributionDto>>> GetProductContributions(string productId,
            [FromServices] IQueryProductContributionsSelector selector)
        {
            var userId = User.Identity?.IsAuthenticated == true ? User.GetUserId() : null;
            var result = await selector.GetContributions(productId, userId, null);

            return Ok(result);
        }

        [HttpGet("{productId}/contributions/status")]
        [AllowAnonymous]
        public async Task<ActionResult<ProductContributionStatusDto>> GetProductContributionStatus(string productId,
            [FromServices] IFetchProductContributionStatusSelector selector)
        {
            var result = await selector.GetStatus(productId);
            return Ok(result);
        }

        [HttpPost("{productId}/contributions/{contributionId}/vote")]
        [Authorize]
        public async Task<ActionResult> VoteContribution(string productId, string contributionId,
            [FromBody] VoteContributionRequestDto request)
        {
            var userId = User.GetUserId();
            var admin = User.IsAdmin();

            var status =
                await _mediator.Send(new VoteProductContributionRequest(userId, contributionId, request.Approve));

            if (admin && status == ProductContributionStatus.Pending)
            {
                if (request.Approve)
                {
                    await _mediator.Send(new ApplyProductContributionRequest(contributionId,
                        "Immediately applied because admin voted approve."));
                }
                else
                {
                    await _mediator.Send(new RejectProductContributionRequest(contributionId,
                        "Immediately rejected because admin voted disapprove."));
                }
            }

            return Ok();
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
        public async Task<ActionResult<IReadOnlyList<ProductCatalogReference>>> GetIndexFile(
            [FromServices] IProductRepository repository)
        {
            var productsUrl = Url.ActionLink(nameof(GetAllProducts));
            var latestChange = await repository.GetLatestProductChange();

            return Ok(new List<ProductCatalogReference> { new(productsUrl!, latestChange ?? DateTimeOffset.MinValue) });
        }

        private async Task EnsureProductWritable(string productId)
        {
            var productDocument = await _productRepository.FindById(productId);
            if (productDocument == null)
                throw ProductError.ProductNotFound(productId).ToException();

            if (productDocument.MirrorInfo?.ReadOnly == true)
                throw ProductError.ProductIsReadOnly(productId).ToException();
        }
    }
}
