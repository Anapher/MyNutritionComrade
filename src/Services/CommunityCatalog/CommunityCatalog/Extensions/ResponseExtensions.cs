using System.Collections.Generic;
using System.Collections.Immutable;
using System.Net;
using CommunityCatalog.Core.Dto;
using CommunityCatalog.Core.Errors;
using CommunityCatalog.Core.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCatalog.Extensions
{
    public static class ResponseExtensions
    {
        private static IImmutableDictionary<string, int> ErrorStatusCodes { get; } =
            new Dictionary<ErrorType, HttpStatusCode>
            {
                { ErrorType.BadRequest, HttpStatusCode.BadRequest },
                { ErrorType.Conflict, HttpStatusCode.Conflict },
                { ErrorType.InternalServerError, HttpStatusCode.InternalServerError },
                { ErrorType.Forbidden, HttpStatusCode.Forbidden },
                { ErrorType.NotFound, HttpStatusCode.NotFound },
            }.ToImmutableDictionary(x => x.Key.ToString(), x => (int)x.Value);

        public static ActionResult ToActionResult(this Error error)
        {
            var httpCode = ErrorStatusCodes[error.Type];

            if (error.Fields?.Count > 0)
                error = error with { Fields = ConvertDictionaryKeysToCamelCase(error.Fields) };

            return new ObjectResult(error) { StatusCode = httpCode };
        }

        private static IReadOnlyDictionary<string, TValue> ConvertDictionaryKeysToCamelCase<TValue>(
            IReadOnlyDictionary<string, TValue> dictionary)
        {
            var newDic = new Dictionary<string, TValue>();
            foreach (var (key, value) in dictionary)
            {
                newDic.Add(key.ToCamelCase(), value);
            }

            return newDic;
        }
    }
}
