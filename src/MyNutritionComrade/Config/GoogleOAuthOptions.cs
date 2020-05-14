namespace MyNutritionComrade.Config
{
    public class GoogleOAuthOptions
    {
        public string Aud { get; set; } = string.Empty;

        /// <summary>
        ///     Allow any google id token and map to a default user, as Google Sign In doesn't work in debug
        /// </summary>
        public bool EnableDeveloperMode { get; set; } = false;

        public string DeveloperToken { get; set; } = "DEVELOPER-TOKEN.fcaa45a9ad7541a798f31e7ca5d797a5.default@127.0.0.1";
    }
}
