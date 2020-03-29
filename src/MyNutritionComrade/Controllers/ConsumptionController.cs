using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
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
        [HttpPut("{date}/{type}/{productId}")]
        public async Task<ActionResult> SetConsumption(string date, string type, string productId, [FromBody] ValueHolder value,
            [FromServices] ISetProductConsumption useCase)
        {
            if (!DateTime.TryParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateTime))
                return BadRequest("The url parameter must be a valid date time.");

            if (!Enum.TryParse<ConsumptionTime>(type, true, out var consumptionTime))
                return BadRequest("The url parameter must be a valid consumption time.");

            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;
            await useCase.Handle(new SetProductConsumptionRequest(userId, dateTime, consumptionTime, productId, value.Value));

            if (useCase.HasError)
                return useCase.ToActionResult();

            return Ok();
        }

        [HttpGet("{date}")]
        public async Task<ActionResult<List<ConsumedProductDto>>> GetDayConsumption(string date, [FromServices] IConsumedProductsOfTheDay selector)
        {
            if (!DateTime.TryParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateTime))
                return BadRequest("The url parameter must be a valid date time.");

            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;
            return await selector.GetConsumedProductsOfTheDay(userId, dateTime);
        }

        public class ValueHolder
        {
            public int Value { get; set; }
        }
    }
}
