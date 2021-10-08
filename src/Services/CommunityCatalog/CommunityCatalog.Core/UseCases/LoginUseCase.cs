using System;
using System.Threading;
using System.Threading.Tasks;
using CommunityCatalog.Core.Extensions;
using CommunityCatalog.Core.Gateways.Repos;
using CommunityCatalog.Core.Gateways.Services;
using CommunityCatalog.Core.Requests;
using MediatR;
using Microsoft.IdentityModel.Tokens;

namespace CommunityCatalog.Core.UseCases
{
    public class LoginUseCase : IRequestHandler<LoginRequest, string>
    {
        private readonly IAdminRepository _adminRepository;
        private readonly IJwtFactory _jwtFactory;
        private readonly IPasswordHandler _passwordHandler;

        public LoginUseCase(IPasswordHandler passwordHandler, IJwtFactory jwtFactory, IAdminRepository adminRepository)
        {
            _passwordHandler = passwordHandler;
            _jwtFactory = jwtFactory;
            _adminRepository = adminRepository;
        }

        public async Task<string> Handle(LoginRequest request, CancellationToken cancellationToken)
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

            var isAdmin = await _adminRepository.IsAdmin(request.EmailAddress);

            var emailHash = _passwordHandler.GetSaltedEmailHash(request.EmailAddress);
            var token = await _jwtFactory.GenerateEncodedToken(Base64UrlEncoder.Encode(emailHash), isAdmin);
            return token;
        }
    }
}
