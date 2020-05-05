using System.Collections.Generic;
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
    public class UserServiceController : Controller
    {
        [HttpGet("frequently_used_products")]
        public async Task<ActionResult<Dictionary<ConsumptionTime, FrequentlyUsedProductDto[]>>> GetFrequentlyUsedProducts(
            [FromServices] IFrequentlyUsedProducts frequentlyUsed)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;
            return await frequentlyUsed.GetFrequentlyUsedProducts(userId);
        }

        [HttpGet("sum_nutrition_goal")]
        public async Task<ActionResult<UserNutritionGoal>> SumNutritionGoals([FromServices] ICalculateCurrentNutritionGoalUseCase useCase)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            var response = await useCase.Handle(new CalculateCurrentNutritionGoalRequest(userId));
            if (useCase.HasError)
                return useCase.Error!.ToActionResult();

            return Ok(response!);
        }
    }
}
