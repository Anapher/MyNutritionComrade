using System.Collections.Generic;
using MyNutritionComrade.Core.Dto;

namespace MyNutritionComrade.Core.Errors
{
    public class InvalidOperationError : Error
    {
        public InvalidOperationError(string message, ErrorCode code, IReadOnlyDictionary<string, string>? fields = null) : base(
            ErrorType.InvalidOperation.ToString(), message, (int) code, fields)
        {
        }
    }
}
