namespace MyNutritionComrade.Core.Domain.Entities.Account
{
    public class GoogleUserMetadata : UserMetadata
    {
        public GoogleUserMetadata(string emailAddress)
        {
            EmailAddress = emailAddress;
        }

        public override UserType UserType { get; } = UserType.Google;

        public string EmailAddress { get; set; }
    }
}
