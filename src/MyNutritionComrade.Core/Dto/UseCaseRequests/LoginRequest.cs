using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public abstract class LoginRequest : IUseCaseRequest<LoginResponse>
    {
        protected LoginRequest(string? remoteIpAddress)
        {
            RemoteIpAddress = remoteIpAddress;
        }

        public string? RemoteIpAddress { get; }
    }

    public class CustomLoginRequest : LoginRequest
    {
        public CustomLoginRequest(string? userName, string? password, string? remoteIpAddress) : base(remoteIpAddress)
        {
            UserName = userName;
            Password = password;
        }

        public string? UserName { get; }
        public string? Password { get; }
    }

    public class GoogleLoginRequest : LoginRequest
    {
        public GoogleLoginRequest(string subject, string emailAddress, string? remoteIpAddress) : base(remoteIpAddress)
        {
            Subject = subject;
            EmailAddress = emailAddress;
        }

        public string Subject { get; }
        public string EmailAddress { get; }
    }
}
