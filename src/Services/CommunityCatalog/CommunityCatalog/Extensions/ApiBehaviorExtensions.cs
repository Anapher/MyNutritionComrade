using System.Linq;
using CommunityCatalog.Core.Errors;
using CommunityCatalog.Core.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace CommunityCatalog.Extensions
{
    public static class ApiBehaviorExtensions
    {
        public static void UseInvalidModelStateToError(this ApiBehaviorOptions options)
        {
            options.InvalidModelStateResponseFactory = context =>
            {
                var errorsWithMessage = context.ModelState
                    .Where(x => x.Value?.ValidationState == ModelValidationState.Invalid).ToDictionary(
                        x => string.Join('.', x.Key.Split('.').Select(StringExtensions.ToCamelCase)),
                        x => x.Value!.Errors.First().ErrorMessage);

                var fieldValidationError = new FieldValidationError(errorsWithMessage);
                return new BadRequestObjectResult(fieldValidationError);
            };
        }
    }
}
