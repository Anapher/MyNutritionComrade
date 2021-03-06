using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Core.Interfaces.UseCases;
using System.Linq;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Extensions;

namespace MyNutritionComrade.Core.UseCases
{
    public class ExchangeRefreshTokenUseCase : UseCaseStatus<ExchangeRefreshTokenResponse>, IExchangeRefreshTokenUseCase
    {
        private readonly IJwtValidator _jwtValidator;
        private readonly IUserRepository _userRepository;
        private readonly IJwtFactory _jwtFactory;
        private readonly ITokenFactory _tokenFactory;

        public ExchangeRefreshTokenUseCase(IJwtValidator jwtValidator, IUserRepository userRepository, IJwtFactory jwtFactory, ITokenFactory tokenFactory)
        {
            _jwtValidator = jwtValidator;
            _userRepository = userRepository;
            _jwtFactory = jwtFactory;
            _tokenFactory = tokenFactory;
        }

        public async Task<ExchangeRefreshTokenResponse?> Handle(ExchangeRefreshTokenRequest message)
        {
            var claimsPrincipal = _jwtValidator.GetPrincipalFromToken(message.AccessToken);
            if (claimsPrincipal == null)
            {
                // invalid token/signing key was passed and we can't extract user claims
                return ReturnError(AuthenticationError.InvalidToken);
            }

            var id = claimsPrincipal.Claims.First(x => x.Type == "id");

            if (!(await _userRepository.ValidateUser(id.Value)).Result(out var error, out var user))
            {
                return ReturnError(error);
            }

            if (!user.HasValidRefreshToken(message.RefreshToken))
                return ReturnError(AuthenticationError.InvalidToken);

            var jwToken = await _jwtFactory.GenerateEncodedToken(user.Id);
            var refreshToken = _tokenFactory.GenerateToken();

            user.RemoveRefreshToken(message.RefreshToken);
            user.AddRefreshToken(refreshToken, message.RemoteIpAddress);

            await _userRepository.Update(user);
            return new ExchangeRefreshTokenResponse(jwToken, refreshToken);
        }
    }
}
