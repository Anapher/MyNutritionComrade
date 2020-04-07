﻿using System.Collections.Generic;
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
using MyNutritionComrade.Core.Extensions;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Core.Utilities;
using MyNutritionComrade.Extensions;
using MyNutritionComrade.Infrastructure.Helpers;
using MyNutritionComrade.Models.Response;
using MyNutritionComrade.Selectors;

namespace MyNutritionComrade.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductsController : Controller
    {
        [AllowAnonymous]
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ProductSearchDto>>> SearchProduct([RequiredFromQuery] string barcode,
            [FromServices] IProductRepository repository, [FromServices] IMapper mapper)
        {
            if (string.IsNullOrEmpty(barcode))
                return new FieldValidationError("The query parameter barcode is required.", "query").ToActionResult();

            var product = await repository.FindByBarcode(barcode);
            if (product == null) return ImmutableList<ProductSearchDto>.Empty;

            return mapper.Map<ProductSearchDto>(product).Yield().ToList();
        }

        [AllowAnonymous]
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ProductSearchDto>>> SearchProduct([RequiredFromQuery] string term, [FromQuery] string? units,
            [FromServices] ISearchProductSelector searchProductSelector, [FromServices] IMapper mapper)
        {
            if (string.IsNullOrEmpty(term))
                return new FieldValidationError("The query parameter term is required.", "query").ToActionResult();

            var unitsArray = units?.Split(',');
            var result = await searchProductSelector.SearchProducts(term, unitsArray);

            return result.Select(mapper.Map<ProductSearchDto>).ToList();
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
        public async Task<ActionResult> PatchProduct(string id, [FromQuery] int? version, List<PatchOperation> operations,
            [FromServices] IPatchProductUseCase useCase)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            var response = await useCase.Handle(new PatchProductRequest(id, operations, userId));
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
