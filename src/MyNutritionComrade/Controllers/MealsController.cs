using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Extensions;
using MyNutritionComrade.Infrastructure.Data.Indexes;
using MyNutritionComrade.Infrastructure.Helpers;
using Raven.Client.Documents;
using Raven.Client.Documents.Session;

namespace MyNutritionComrade.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class MealsController : Controller
    {
        [HttpPost]
        public async Task<ActionResult<Meal>> CreateMeal([FromBody] CreateMealDto meal, [FromServices] ICreateMealUseCase useCase)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            var result = await useCase.Handle(new CreateMealRequest(meal, userId));
            if (useCase.HasError)
                return useCase.Error!.ToActionResult();

            return Ok(result!.Meal);
        }

        [HttpGet]
        public async Task<ActionResult<Meal>> GetMeals([FromServices] IAsyncDocumentSession session)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            var meals = await session.Query<Meal, Meal_ByUserId>().Where(x => x.UserId == userId).ToListAsync();
            return Ok(meals);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Meal>> DeleteMeal(string id, [FromServices] IDeleteMealUseCase useCase)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            await useCase.Handle(new DeleteMealRequest(id, userId));
            if (useCase.HasError)
                return useCase.Error!.ToActionResult();

            return Ok();
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<Meal>> PatchMeal(JsonPatchDocument<CreateMealDto> patchDocument, string id, [FromServices] IPatchMealUseCase useCase)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            var response = await useCase.Handle(new PatchMealRequest(userId, id, patchDocument));
            if (useCase.HasError)
                return useCase.Error!.ToActionResult();

            return Ok(response!.Meal);
        }
    }
}
