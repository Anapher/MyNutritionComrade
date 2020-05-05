using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Domain.Entities.Goal;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Extensions;
using MyNutritionComrade.Infrastructure.Helpers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MyNutritionComrade.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class UserSettingsController : Controller
    {
        private readonly JsonSerializer _jsonSerializer;

        public UserSettingsController(JsonSerializer jsonSerializer)
        {
            _jsonSerializer = jsonSerializer;
        }

        [HttpGet]
        public async Task<ActionResult<UserSettings>> GetInfo([FromServices] IUserSettingsRepository repository)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;
            var info = await repository.GetUserSettings(userId) ?? new UserSettings();

            return Ok(info);
        }

        [HttpPatch]
        public async Task<ActionResult<UserSettings>> Patch([FromBody] JsonPatchDocument<UserSettings> patch, [FromServices] IPatchUserSettingsUseCase useCase)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;

            // deserialize nutrition goals
            foreach (var operation in patch.Operations)
            {
                if (operation.path.StartsWith("/nutritionGoal/") && !operation.path.Substring("/nutritionGoal/".Length).Contains("/"))
                {
                    if (operation.value is JObject jobj)
                        operation.value = jobj.ToObject<NutritionGoalBase>(_jsonSerializer);
                }
            }

            var info = await useCase.Handle(new PatchUserSettingsRequest(patch, userId));
            if (useCase.HasError)
                return useCase.Error!.ToActionResult();

            return Ok(info!.Result);
        }
    }
}
