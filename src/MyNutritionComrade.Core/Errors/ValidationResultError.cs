using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation.Results;
using MyNutritionComrade.Core.Dto;

namespace MyNutritionComrade.Core.Errors
{
    public class ValidationResultError : Error
    {
        public ValidationResultError(ValidationResult validationResult, string? message = null, ErrorCode code = ErrorCode.FieldValidation,
            IReadOnlyDictionary<string, string>? fields = null, ErrorType errorType = ErrorType.ValidationError) : base(errorType.ToString(),
            $"Validation failed. {message}{Environment.NewLine}{string.Join(Environment.NewLine, validationResult.Errors.Select(x => x.ToString()))}",
            (int) code, fields)
        {
            if (validationResult.IsValid) throw new ArgumentException("The validation result must have failed to be converted to an error.");
        }
    }
}
