using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MongoDB.Concurrency.Optimistic;

namespace CommunityCatalog.Services
{
    public class MongoConcurrencyPipeline<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        private const int RETRIES = 5;

        public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken,
            RequestHandlerDelegate<TResponse> next)
        {
            for (var i = 0; i < RETRIES - 1; i++)
            {
                try
                {
                    return await next();
                }
                catch (Exception ex) when (ex is MongoConcurrencyDeletedException or MongoConcurrencyUpdatedException)
                {
                }
            }

            return await next();
        }
    }
}
