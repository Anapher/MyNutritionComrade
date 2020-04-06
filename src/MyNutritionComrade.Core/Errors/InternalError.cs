using System.Collections.Generic;
using MyNutritionComrade.Core.Dto;

namespace MyNutritionComrade.Core.Errors
{
    public class InternalError : Error
    {
        public InternalError(string message, ErrorCode code, IReadOnlyDictionary<string, string>? fields = null) : base(ErrorType.InternalError.ToString(),
            message, (int) code, fields)
        {
        }
    }
}
