using MyNutritionComrade.Core.Domain.Entities.Account;

namespace MyNutritionComrade.Core.Tests._Helpers
{
    public static class UserHelper
    {
        public static User Default(string userId = "test id") => new User(userId, new CustomUserMetadata("nope", "vincent"));
    }
}
