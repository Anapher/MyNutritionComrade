using CommunityCatalog.Core.Dto;
using CommunityCatalog.Core.Errors;

namespace CommunityCatalog.Core
{
    public class AuthError : ErrorsProvider<NutritionComradeErrorCode>
    {
        public static Error InvalidPassword()
        {
            return BadRequest("The password you submitted is invalid.", NutritionComradeErrorCode.Auth_InvalidPassword);
        }
    }
}
