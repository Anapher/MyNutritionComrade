using MyNutritionComrade.Models.Request;
using FluentValidation;

namespace MyNutritionComrade.Models.Validation
{
    public class LoginRequestValidator : AbstractValidator<LoginRequestDto>
    {
        public LoginRequestValidator()
        {
            RuleFor(x => x.UserName).NotEmpty();
            RuleFor(x => x.Password).NotEmpty();
        }
    }
}
