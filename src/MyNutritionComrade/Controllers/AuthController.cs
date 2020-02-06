using System.Threading.Tasks;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Extensions;
using MyNutritionComrade.Models.Request;
using MyNutritionComrade.Models.Response;
using Microsoft.AspNetCore.Mvc;

namespace MyNutritionComrade.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        // POST api/v1/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request, [FromServices] ILoginUseCase loginUseCase)
        {
            var result = await loginUseCase.Handle(new LoginRequest(request.UserName, request.Password, HttpContext.Connection.RemoteIpAddress?.ToString()));
            if (loginUseCase.HasError)
            {
                return loginUseCase.ToActionResult();
            }

            return new LoginResponseDto(result!.AccessToken, result.RefreshToken);
        }

        // POST api/v1/auth/refreshtoken
        [HttpPost("refreshtoken")]
        public async Task<ActionResult<ExchangeRefreshTokenResponseDto>> RefreshToken([FromBody] ExchangeRefreshTokenRequestDto request, [FromServices] IExchangeRefreshTokenUseCase useCase)
        {
            var result = await useCase.Handle(new ExchangeRefreshTokenRequest(request.AccessToken, request.RefreshToken, HttpContext.Connection.RemoteIpAddress?.ToString()));
            if (useCase.HasError)
            {
                return useCase.ToActionResult();
            }

            return new ExchangeRefreshTokenResponseDto(result!.AccessToken, result.RefreshToken);
        }
    }
}