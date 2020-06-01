using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Extensions;
using MyNutritionComrade.Infrastructure.Helpers;
using MyNutritionComrade.Models.Response;
using MyNutritionComrade.Selectors;

namespace MyNutritionComrade.Controllers
{
    [Route("api/v1/[controller]")]
    [Authorize]
    [ApiController]
    public class ConsumptionController : Controller
    {
        [HttpPut("{date}/{type}")]
        public async Task<ActionResult<ConsumedDto>> CreateConsumption(string date, string type, [FromBody] FoodPortionCreationDto value,
            [FromServices] ICreateConsumptionUseCase useCase, [FromServices] IConsumedDtoSelector selector)
        {
            if (!DateTime.TryParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateTime))
                return BadRequest("The url parameter must be a valid date time.");

            if (!Enum.TryParse<ConsumptionTime>(type, true, out var consumptionTime))
                return BadRequest("The url parameter must be a valid consumption time.");

            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;
            var response = await useCase.Handle(new CreateConsumptionRequest(userId, dateTime, consumptionTime, value));

            if (useCase.HasError)
                return useCase.ToActionResult();

            var result = await selector.SelectConsumedDtos(new[] {response!.Consumed});
            return Ok(result.Single());
        }

        [HttpDelete("{date}/{type}/{compoundFoodId}")]
        public async Task<ActionResult> DeleteConsumption(string date, string type, string compoundFoodId,  [FromServices] IDeleteConsumptionUseCase useCase)
        {
            if (!DateTime.TryParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateTime))
                return BadRequest("The url parameter must be a valid date time.");

            if (!Enum.TryParse<ConsumptionTime>(type, true, out var consumptionTime))
                return BadRequest("The url parameter must be a valid consumption time.");

            var parts = compoundFoodId.Split('@', 2);
            if (parts.Length != 2)
                return BadRequest("The food id must be the type separated with an '@'.");

            if (!Enum.TryParse<FoodPortionType>(parts[0], true, out var foodPortionType))
                return BadRequest("The food id must be the type separated with an '@'.");

            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;
            await useCase.Handle(new DeleteConsumptionRequest(userId, dateTime, consumptionTime, parts[1], foodPortionType));

            if (useCase.HasError)
                return useCase.ToActionResult();

            return Ok();
        }

        [HttpGet("{date}")]
        public async Task<ActionResult<Dictionary<string, List<ConsumedDto>>>> GetDayConsumption(string date, [FromQuery] string? to,
            [FromServices] IConsumedOfTheDay selector)
        {
            if (!DateTime.TryParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateTime))
                return BadRequest("The url parameter must be a valid date time.");

            var daysBack = 0;
            if (to != null)
            {
                if (!DateTime.TryParseExact(to, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var toDate))
                    return BadRequest("The query parameter 'to' must be a valid date time.");

                daysBack = Math.Abs((int) (dateTime - toDate).TotalDays);
                dateTime = toDate > dateTime ? toDate : dateTime;
            }

            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;
            var result = (await selector.GetConsumedOfTheDay(userId, dateTime, daysBack));

            return result.ToDictionary(x => x.Key.ToString("yyy-MM-dd"), x => x.Value);
        }
    }
}
