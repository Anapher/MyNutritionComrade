using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Extensions;
using MyNutritionComrade.Infrastructure.Helpers;

namespace MyNutritionComrade.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class NutritionGoalController : Controller
    {
        [HttpGet]
        public async Task<ActionResult<UserNutritionGoal>> GetNutritionGoals([FromServices] INutritionGoalRepository repository)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;
            var info = await repository.GetByUser(userId) ?? new UserNutritionGoal();

            return Ok(info);
        }

        [HttpGet("sum")]
        public async Task<ActionResult<UserNutritionGoal>> SumNutritionGoals([FromServices] ICalculateCurrentNutritionGoalUseCase useCase)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            var response = await useCase.Handle(new CalculateCurrentNutritionGoalRequest(userId));
            if (useCase.HasError)
                return useCase.Error!.ToActionResult();

            return Ok(response!);
        }

        [HttpPatch]
        public async Task<ActionResult<UserNutritionGoal>> PatchNutritionGoals([FromBody]UserNutritionGoal newNutritionGoal,
            [FromServices] IPatchNutritionGoalsUseCase useCase)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            var response = await useCase.Handle(new PatchNutritionGoalsRequest(newNutritionGoal, userId));
            if (useCase.HasError)
                return useCase.Error!.ToActionResult();

            return response!.Result;
        }
    }
}
