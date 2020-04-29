using System;
using FluentValidation;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Domain.Validation
{
    public class UserPersonalInfoValidator : AbstractValidator<UserPersonalInfo>
    {
        public UserPersonalInfoValidator()
        {
            RuleFor(x => x.Height).GreaterThan(0);
            RuleFor(x => x.Gender).IsInEnum();
            RuleFor(x => x.Birthday).Must(x => x == null || DateTime.UtcNow > x).WithMessage("The birthday must not be in future.");
        }
    }
}
