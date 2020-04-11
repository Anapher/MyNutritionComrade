using FluentValidation;
using MyNutritionComrade.Models.Paging;

namespace MyNutritionComrade.Models.Validation
{
    public class PagingRequestValidator : AbstractValidator<PagingRequest>
    {
        public PagingRequestValidator()
        {
            RuleFor(x => x.PageSize).GreaterThan(0);
            RuleFor(x => x.SortDirection).IsInEnum();
        }
    }
}
