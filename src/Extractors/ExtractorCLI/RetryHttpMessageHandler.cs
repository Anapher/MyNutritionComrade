using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Extractor.Interface;

namespace ExtractorCLI
{
    public class RetryHttpMessageHandler : DelegatingHandler
    {
        private readonly ILogger _logger;

        public RetryHttpMessageHandler(HttpMessageHandler handler, ILogger logger) : base(handler)
        {
            _logger = logger;
        }

        public int MaxRetryCount { get; set; } = 4;
        public TimeSpan RetryDelay { get; set; } = TimeSpan.FromSeconds(5);

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            return SendAsync(request, cancellationToken, 0);
        }

        private async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,
            CancellationToken cancellationToken, int retryCounter)
        {
            try
            {
                var response = await base.SendAsync(request, cancellationToken);
                response.EnsureSuccessStatusCode();

                return response;
            }
            catch (Exception e)
            {
                _logger.Log($"Request error occurred: {e.Message} | Try: {retryCounter}");
                if (retryCounter >= MaxRetryCount) throw;

                await Task.Delay(RetryDelay, cancellationToken);
                return await SendAsync(request, cancellationToken, retryCounter + 1);
            }
        }
    }
}
