using System.Collections.Generic;

namespace MyNutritionComrade.Core.Errors
{
    public class EntityNotFoundError : DomainError
    {
        public EntityNotFoundError(string message, ErrorCode code, IReadOnlyDictionary<string, string>? fields = null) : base(ErrorType.EntityNotFound,
            message, code, fields)
        {
        }
    }
}
