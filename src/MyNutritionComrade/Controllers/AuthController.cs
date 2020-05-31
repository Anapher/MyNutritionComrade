using System.Threading.Tasks;
using Google.Apis.Auth;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Extensions;
using MyNutritionComrade.Models.Request;
using MyNutritionComrade.Models.Response;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MyNutritionComrade.Config;

namespace MyNutritionComrade.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly ILogger<AuthController> _logger;

        public AuthController(ILogger<AuthController> logger)
        {
            _logger = logger;
        }

        // POST api/v1/auth/login
        //[HttpPost("login")]
        //public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request, [FromServices] ILoginUseCase loginUseCase)
        //{
        //    var result = await loginUseCase.Handle(new CustomLoginRequest(request.UserName, request.Password, HttpContext.Connection.RemoteIpAddress?.ToString()));
        //    if (loginUseCase.HasError)
        //    {
        //        return loginUseCase.ToActionResult();
        //    }

        //    return new LoginResponseDto(result!.AccessToken, result.RefreshToken);
        //}

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

        // POST api/v1/auth/login_with_google
        [HttpPost("login_with_google")]
        public async Task<ActionResult<LoginResponseDto>> LoginWithGoogle([FromBody] string idToken, [FromServices] IOptions<GoogleOAuthOptions> options,
            [FromServices] ILoginUseCase loginUseCase, [FromServices]IGoogleAuthValidator authValidator)
        {
            GoogleLoginRequest request;

            if (options.Value.EnableDeveloperMode && idToken == options.Value.DeveloperToken)
            {
                _logger.LogWarning("Developer Mode is enabled for Google Authentication, so the DeveloperToken will be a valid authentication token!");

                var subject = options.Value.DeveloperToken.Split('.', 3)[1];
                var email = options.Value.DeveloperToken.Split('.', 3)[2];
                request = new GoogleLoginRequest(subject, email, HttpContext.Connection.RemoteIpAddress?.ToString());
            }
            else
            {
                _logger.LogDebug("Received auth request using google with id token: {idToken}", idToken);

                GoogleJsonWebSignature.Payload user;
                try
                {
                    user = await authValidator.ValidateAsync(idToken);
                }
                catch (InvalidJwtException e)
                {
                    _logger.LogDebug(e, "Validation of id token failed.");
                    return Unauthorized();
                }

                _logger.LogDebug("idToken validated successfully, creating user...");

                request = new GoogleLoginRequest(user.Subject, user.Email, HttpContext.Connection.RemoteIpAddress?.ToString());
            }

            var result = await loginUseCase.Handle(request);
            if (loginUseCase.HasError)
            {
                return loginUseCase.ToActionResult();
            }

            return new LoginResponseDto(result!.AccessToken, result.RefreshToken);
        }
    }
}