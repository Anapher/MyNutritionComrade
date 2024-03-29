﻿using System;
using CommunityCatalog.Core.Dto;

namespace CommunityCatalog.Core.Errors
{
    public record DomainError<TCodeEnum> : Error where TCodeEnum : Enum
    {
        public DomainError(ErrorType errorType, string message, TCodeEnum code) : base(errorType.ToString(), message,
            code.ToString())
        {
        }
    }
}
