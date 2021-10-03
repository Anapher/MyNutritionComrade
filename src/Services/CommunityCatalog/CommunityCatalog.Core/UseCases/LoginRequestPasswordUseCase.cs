using System;
using System.Threading;
using System.Threading.Tasks;
using CommunityCatalog.Core.Errors;
using CommunityCatalog.Core.Extensions;
using CommunityCatalog.Core.Gateways.Services;
using CommunityCatalog.Core.Options;
using CommunityCatalog.Core.Requests;
using MediatR;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace CommunityCatalog.Core.UseCases
{
    public class LoginRequestPasswordUseCase : IRequestHandler<LoginRequestPasswordRequest>
    {
        private readonly IEmailSender _emailSender;
        private readonly IPasswordHandler _passwordHandler;
        private readonly IdentityOptions _options;

        public LoginRequestPasswordUseCase(IEmailSender emailSender, IPasswordHandler passwordHandler,
            IOptions<IdentityOptions> options)
        {
            _emailSender = emailSender;
            _passwordHandler = passwordHandler;
            _options = options.Value;
        }

        public async Task<Unit> Handle(LoginRequestPasswordRequest request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.EmailAddress))
                throw new FieldValidationError("The email address must not be empty",
                    ErrorCode.FieldValidation.ToString()).ToException();

            var passwordToken = _passwordHandler.GeneratePassword(request.EmailAddress,
                TimeSpan.FromHours(_options.PasswordValidForHours));

            var passwordTokenString = Base64UrlEncoder.Encode(passwordToken);
            await _emailSender.SendPasswordToEmail(request.EmailAddress, passwordTokenString);

            return Unit.Value;
        }
    }
}
