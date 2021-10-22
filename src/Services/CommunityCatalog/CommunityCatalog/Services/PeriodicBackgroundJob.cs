using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;

namespace CommunityCatalog.Services
{
    public abstract class PeriodicBackgroundJob : IHostedService
    {
        public Task StartAsync(CancellationToken cancellationToken)
        {
            Task.Run(async () =>
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    await RunAsync(cancellationToken);
                    await Task.Delay(GetNextExecutionTime() - DateTimeOffset.UtcNow, cancellationToken);
                }
            }, cancellationToken);
            return Task.CompletedTask;
        }

        protected abstract Task RunAsync(CancellationToken cancellationToken);

        protected abstract DateTimeOffset GetNextExecutionTime();

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
