using System;
using CommunityCatalog.Core;
using CommunityCatalog.Core.Dto;

namespace CommunityCatalog.Extensions
{
    public static class ExceptionExtensions
    {
        public static Error ToError(this Exception e)
        {
            if (e is IdErrorException idError)
                return idError.Error;

            return ProductError.UnexpectedError();
        }
    }
}
