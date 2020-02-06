using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class ExchangeRefreshTokenRequest : IUseCaseRequest<ExchangeRefreshTokenResponse>
    {
        public string AccessToken { get; }
        public string RefreshToken { get; }
        public string? RemoteIpAddress { get; }

        public ExchangeRefreshTokenRequest(string accessToken, string refreshToken, string? remoteIpAddress)
        {
            AccessToken = accessToken;
            RefreshToken = refreshToken;
            RemoteIpAddress = remoteIpAddress;
        }
    }
}
