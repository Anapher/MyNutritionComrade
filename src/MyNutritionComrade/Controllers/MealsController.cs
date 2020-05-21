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
using MyNutritionComrade.Models.Response;
using MyNutritionComrade.Selectors;
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
        public async Task<ActionResult<Meal>> CreateMeal([FromBody] CreateMealDto meal, [FromServices] ICreateMealUseCase useCase, [FromServices]IFoodPortionDtoSelector selector)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            var response = await useCase.Handle(new CreateMealRequest(meal, userId));
            if (useCase.HasError)
                return useCase.Error!.ToActionResult();

            return Ok(await MapToMealDto(response!.Meal, selector));
        }

        [HttpGet]
        public async Task<ActionResult<Meal>> GetMeals([FromServices] IAsyncDocumentSession session, [FromServices] IFoodPortionDtoSelector selector)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            var meals = await session.Query<Meal, Meal_ByUserId>().Where(x => x.UserId == userId).ToListAsync();

            var allFoodPortions = meals.SelectMany(x => x.Items).ToList();
            var foodPortionDtos = await selector.SelectViewModels(allFoodPortions);

            return Ok(meals.Select(meal => new MealDto
            {
                Id = meal.Id,
                Name = meal.Name,
                CreatedOn = meal.CreatedOn,
                NutritionalInfo = meal.NutritionalInfo,
                Items = meal.Items.Select(x => foodPortionDtos[x]).ToList()
            }));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMeal(string id, [FromServices] IDeleteMealUseCase useCase)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            await useCase.Handle(new DeleteMealRequest(id, userId));
            if (useCase.HasError)
                return useCase.Error!.ToActionResult();

            return Ok();
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<Meal>> PatchMeal(JsonPatchDocument<CreateMealDto> patchDocument, string id, [FromServices] IPatchMealUseCase useCase, [FromServices] IFoodPortionDtoSelector selector)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            var response = await useCase.Handle(new PatchMealRequest(userId, id, patchDocument));
            if (useCase.HasError)
                return useCase.Error!.ToActionResult();

            return Ok(await MapToMealDto(response!.Meal, selector));
        }

        private static async ValueTask<MealDto> MapToMealDto(Meal meal, IFoodPortionDtoSelector selector)
        {
            var items = await selector.SelectViewModels(meal.Items);

            return new MealDto
            {
                Id = meal.Id,
                Name = meal.Name,
                CreatedOn = meal.CreatedOn,
                NutritionalInfo = meal.NutritionalInfo,
                Items = items.Values
            };
        }
    }
}
