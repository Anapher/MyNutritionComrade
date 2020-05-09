namespace MyNutritionComrade.Core.Domain.Entities.Account
{
    public class CustomUserMetadata : UserMetadata
    {
        public CustomUserMetadata(string passwordHash, string userName)
        {
            PasswordHash = passwordHash;
            UserName = userName;
        }

        public override UserType UserType { get; } = UserType.Custom;

        public string? Email { get; set; }
        public string PasswordHash { get; set; }
        public string? UnconfirmedEmailAddress { get; set; }
        public string UserName { get; private set; }

        public bool HasConfirmedEmailAddress() => Email != null;
    }
}