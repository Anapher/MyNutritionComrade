using System.Threading.Tasks;
using Google.Apis.Auth;
using Microsoft.Extensions.Options;

namespace MyNutritionComrade.Config
{
    public interface IGoogleAuthValidator
    {
        Task<GoogleJsonWebSignature.Payload> ValidateAsync(string idToken);
    }

    public class GoogleAuthValidator : IGoogleAuthValidator
    {
        private readonly GoogleJsonWebSignature.ValidationSettings _settings;

        public GoogleAuthValidator(IOptions<GoogleOAuthOptions> options)
        {
            _settings = new GoogleJsonWebSignature.ValidationSettings();
            if (!string.IsNullOrEmpty(options.Value.Aud)) _settings.Audience = new[] {options.Value.Aud};
        }

        public Task<GoogleJsonWebSignature.Payload> ValidateAsync(string idToken) => GoogleJsonWebSignature.ValidateAsync(idToken, _settings);
    }
}
