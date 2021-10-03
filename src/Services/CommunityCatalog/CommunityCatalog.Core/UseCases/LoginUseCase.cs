using System;
using System.Threading;
using System.Threading.Tasks;
using CommunityCatalog.Core.Extensions;
using CommunityCatalog.Core.Gateways.Services;
using CommunityCatalog.Core.Requests;
using MediatR;
using Microsoft.IdentityModel.Tokens;

namespace CommunityCatalog.Core.UseCases
{
    public class LoginUseCase : IRequestHandler<LoginRequest, string>
    {
        private readonly IPasswordHandler _passwordHandler;
        private readonly IJwtFactory _jwtFactory;

        public LoginUseCase(IPasswordHandler passwordHandler, IJwtFactory jwtFactory)
        {
            _passwordHandler = passwordHandler;
            _jwtFactory = jwtFactory;
        }

        public Task<string> Handle(LoginRequest request, CancellationToken cancellationToken)
        {
            byte[] decodedPassword;
            try
            {
                decodedPassword = Base64UrlEncoder.DecodeBytes(request.Password);
            }
            catch (Exception)
            {
                throw AuthError.InvalidPassword().ToException();
            }

            if (!_passwordHandler.ValidatePassword(request.EmailAddress, decodedPassword))
            {
                throw AuthError.InvalidPassword().ToException();
            }

            var emailHash = _passwordHandler.GetSaltedEmailHash(request.EmailAddress);
            var token = _jwtFactory.GenerateEncodedToken(Base64UrlEncoder.Encode(emailHash));
            return token;
        }
    }
}
