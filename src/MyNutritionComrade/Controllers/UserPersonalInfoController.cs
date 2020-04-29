using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Domain.Validation;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Extensions;
using MyNutritionComrade.Infrastructure.Helpers;

namespace MyNutritionComrade.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class UserPersonalInfoController : Controller
    {
        [HttpGet]
        public async Task<ActionResult<UserPersonalInfo>> GetInfo([FromServices] IUserPersonalInfoRepository repository)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;
            var info = await repository.GetPersonalInfo(userId) ?? new UserPersonalInfo();

            return Ok(info);
        }

        [HttpPatch]
        public async Task<ActionResult<UserPersonalInfo>> PatchInfo(JsonPatchDocument<UserPersonalInfo> patch, [FromServices] IUserPersonalInfoRepository repository)
        {
            var userId = User.Claims.First(x => x.Type == Constants.Strings.JwtClaimIdentifiers.Id).Value;
            var info = await repository.GetPersonalInfo(userId) ?? new UserPersonalInfo();

            patch.ApplyTo(info);

            var result = await new UserPersonalInfoValidator().ValidateAsync(info);
            if (!result.IsValid)
                return new ValidationResultError(result).ToActionResult();

            await repository.SavePersonalInfo(userId, info);

            return Ok(info);
        }
    }
}
