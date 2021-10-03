using System;
using CommunityCatalog.Core.Dto;

namespace CommunityCatalog.Core
{
    public class IdErrorException : Exception
    {
        public Error Error { get; }

        public IdErrorException(Error error)
        {
            Error = error;
        }

        public override string ToString()
        {
            return Error.ToString();
        }
    }
}
