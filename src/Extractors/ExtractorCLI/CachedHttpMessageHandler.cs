using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Extractor.Interface;

namespace ExtractorCLI
{
    public class CachedHttpMessageHandler : DelegatingHandler
    {
        private readonly string _directory;
        private readonly ILogger _logger;

        public CachedHttpMessageHandler(string directory, HttpMessageHandler handler, ILogger logger) : base(handler)
        {
            _directory = directory;
            _logger = logger;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            Directory.CreateDirectory(_directory);

            if (request.Method == HttpMethod.Get && request.RequestUri != null)
            {
                var cacheEntryKey = BitConverter
                    .ToString(MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(request.RequestUri.ToString())))
                    .Replace("-", "");

                var path = Path.Combine(_directory, cacheEntryKey);
                if (File.Exists(path))
                    return new HttpResponseMessage(HttpStatusCode.OK)
                    {
                        Content = new ByteArrayContent(await File.ReadAllBytesAsync(path, cancellationToken)),
                    };


                _logger.Log("GET " + request.RequestUri);
                var response = await base.SendAsync(request, cancellationToken);
                response.EnsureSuccessStatusCode();

                await File.WriteAllBytesAsync(path, await response.Content.ReadAsByteArrayAsync(cancellationToken),
                    cancellationToken);

                return response;
            }

            return await base.SendAsync(request, cancellationToken);
        }
    }
}
