using System;
using System.Threading;
using System.Threading.Tasks;
using CommunityCatalog.Core.Requests;
using CommunityCatalog.Options;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CommunityCatalog.Services
{
    public record MirrorSynchronizerRunRequest : IRequest;

    public class MirrorSynchronizer : PeriodicBackgroundJob, IRequestHandler<MirrorSynchronizerRunRequest>
    {
        private readonly ILogger<MirrorSynchronizer> _logger;
        private readonly IMediator _mediator;
        private readonly MirrorOptions _options;

        public MirrorSynchronizer(IOptions<MirrorOptions> options, IMediator mediator,
            ILogger<MirrorSynchronizer> logger)
        {
            _mediator = mediator;
            _logger = logger;
            _options = options.Value;
        }

        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Begin synchronizing mirrors...");
            await _mediator.Send(new SynchronizeMirrorsRequest(_options.Indexes));
        }

        protected override DateTimeOffset GetNextExecutionTime()
        {
            return DateTimeOffset.UtcNow + _options.PollFrequency;
        }

        public async Task<Unit> Handle(MirrorSynchronizerRunRequest request, CancellationToken cancellationToken)
        {
            await RunAsync(cancellationToken);
            return Unit.Value;
        }
    }
}
