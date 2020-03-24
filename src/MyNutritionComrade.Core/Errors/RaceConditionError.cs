using System.Collections.Generic;
using MyNutritionComrade.Core.Dto;

namespace MyNutritionComrade.Core.Errors
{
    public class RaceConditionError : Error
    {
        public RaceConditionError(string message, ErrorCode code, IReadOnlyDictionary<string, string>? fields = null) : base(ErrorType.StateError.ToString(),
            message, (int) code, fields)
        {
        }
    }
}
