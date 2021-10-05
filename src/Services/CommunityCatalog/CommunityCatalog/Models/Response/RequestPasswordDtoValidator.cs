using CommunityCatalog.Models.Request;
using FluentValidation;

namespace CommunityCatalog.Models.Response
{
    public class RequestPasswordDtoValidator : AbstractValidator<RequestPasswordDto>
    {
        public RequestPasswordDtoValidator()
        {
            RuleFor(x => x.EmailAddress).EmailAddress().NotEmpty();
        }
    }
}
