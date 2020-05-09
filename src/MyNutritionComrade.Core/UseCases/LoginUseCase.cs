using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Account;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Core.Interfaces.UseCases;

namespace MyNutritionComrade.Core.UseCases
{
    public class LoginUseCase : UseCaseStatus<LoginResponse>, ILoginUseCase
    {
        private readonly IJwtFactory _jwtFactory;
        private readonly ITokenFactory _tokenFactory;
        private readonly IUserRepository _userRepository;

        public LoginUseCase(IUserRepository userRepository, IJwtFactory jwtFactory, ITokenFactory tokenFactory)
        {
            _userRepository = userRepository;
            _jwtFactory = jwtFactory;
            _tokenFactory = tokenFactory;
        }

        public async Task<LoginResponse?> Handle(LoginRequest message)
        {
            User? user = null;
            if (message is GoogleLoginRequest googleLoginRequest)
            {
                user = await _userRepository.FindById(googleLoginRequest.Subject);
                if (user == null)
                {
                    user = new User(googleLoginRequest.Subject, new GoogleUserMetadata(googleLoginRequest.EmailAddress));
                    await _userRepository.Create(user);
                }
            }
            //else if (message is CustomLoginRequest loginRequest)
            //{
            //    //if (string.IsNullOrEmpty(message.UserName))
            //    //    return ReturnError(new FieldValidationError(nameof(message.UserName), "The username must not be empty."));

            //    //if (string.IsNullOrEmpty(message.Password))
            //    //    return ReturnError(new FieldValidationError(nameof(message.Password), "The password must not be empty."));

            //    //var user = await _userRepository.FindByName(message.UserName);
            //    //if (user == null)
            //    //    return ReturnError(AuthenticationError.UserNotFound.SetField(nameof(message.UserName)));

            //    //if (!await _userRepository.CheckPassword(user, message.Password))
            //    //    return ReturnError(new AuthenticationError("The password is invalid.", ErrorCode.InvalidPassword).SetField(nameof(message.Password)));
            //}
            else
            {
                return ReturnError(new InvalidOperationError("Unknown authentication type.", ErrorCode.InvalidOperation));
            }

            if (user == null)
            {
                return ReturnError(new AuthenticationError("The user was not found.", ErrorCode.UserNotFound));
            }

            if (user.IsDisabled)
                return ReturnError(new AuthenticationError("The user account is disabled.", ErrorCode.User_Disabled));

            // generate refresh token
            var refreshToken = _tokenFactory.GenerateToken();
            user.AddRefreshToken(refreshToken, message.RemoteIpAddress);
            await _userRepository.Update(user);

            var accessToken = await _jwtFactory.GenerateEncodedToken(user.Id);

            return new LoginResponse(accessToken, refreshToken);
        }
    }
}
