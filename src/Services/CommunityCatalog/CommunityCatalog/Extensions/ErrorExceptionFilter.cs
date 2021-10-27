using CommunityCatalog.Core;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace CommunityCatalog.Extensions
{
    public class ErrorExceptionFilter : IActionFilter, IOrderedFilter
    {
        private readonly ILogger<ErrorExceptionFilter> _logger;

        public ErrorExceptionFilter(ILogger<ErrorExceptionFilter> logger)
        {
            _logger = logger;
        }

        public int Order => int.MaxValue - 10;

        public void OnActionExecuting(ActionExecutingContext context)
        {
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Exception != null)
            {
                if (context.Exception is not IdErrorException)
                {
                    _logger.LogWarning(context.Exception, "An internal exception was caught");
                }

                context.Result = context.Exception.ToError().ToActionResult();
                context.ExceptionHandled = true;
            }
        }
    }
}
