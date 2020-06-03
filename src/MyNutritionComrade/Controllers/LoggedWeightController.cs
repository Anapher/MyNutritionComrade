using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Extensions;
using MyNutritionComrade.Infrastructure.Helpers;
using MyNutritionComrade.Models.Paging;
using MyNutritionComrade.Selectors;

namespace MyNutritionComrade.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class LoggedWeightController : Controller
    {
        [HttpPut("{timestamp}")]
        public async Task<ActionResult<LoggedWeight>> LogWeight(string timestamp, [FromBody] double weight, [FromServices] ILogWeightUseCase useCase)
        {
            if(!DateTimeOffset.TryParse(timestamp, out var dateTime))
                return new FieldValidationError("timestamp", "The timestamp must be a valid date time.").ToActionResult();

            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            var response = await useCase.Handle(new LogWeightRequest(userId, dateTime, weight));
            if (useCase.HasError)
                return useCase.Error!.ToActionResult();

            return Ok(response!.Entity);
        }

        [HttpDelete("{timestamp}")]
        public async Task<ActionResult<LoggedWeight>> DeleteWeight(string timestamp, [FromServices] IDeleteLoggedWeightUseCase useCase)
        {
            if (!DateTimeOffset.TryParse(timestamp, out var dateTime))
                return new FieldValidationError("timestamp", "The timestamp must be a valid date time.").ToActionResult();

            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            await useCase.Handle(new DeleteLoggedWeightRequest(userId, dateTime));
            if (useCase.HasError)
                return useCase.Error!.ToActionResult();

            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult<PagingResponse<LoggedWeight>>> GetLoggedWeight([FromQuery] PagingRequest request, [FromServices] ILoggedWeightSelector selector)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;
            var result = await selector.GetLoggedWeight(userId, request);

            return Ok(result.MapToController(this, nameof(GetLoggedWeight), new { }));
        }
    }
}
