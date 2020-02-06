using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class LoginRequest : IUseCaseRequest<LoginResponse>
    {
        public string? UserName { get; }
        public string? Password { get; }
        public string? RemoteIpAddress { get; }

        public LoginRequest(string? userName, string? password, string? remoteIpAddress)
        {
            UserName = userName;
            Password = password;
            RemoteIpAddress = remoteIpAddress;
        }
    }
}
