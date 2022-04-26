using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using CommandLine;
using Extractor.Interface;
using Extractors.McDonalds;
using FluentValidation;
using MyNutritionComrade.Models;
using MyNutritionComrade.Models.Validation;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ExtractorCLI
{
    public class Options
    {
        [Option('o', "output", Required = true,
            HelpText = "The root directory where the extracted product information should be put")]
        public string OutputDirectory { get; set; }
    }

    public class ConsoleWriter : IProductWriter
    {
        public ValueTask Write(Product product)
        {
            var validator = new ProductValidator();
            validator.ValidateAndThrow(product);

            var result = JsonConvert.SerializeObject(
                new ProductProperties(product.Code, product.Label, product.NutritionalInfo, product.Servings,
                    product.DefaultServing, product.Tags), Formatting.Indented,
                new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                    NullValueHandling = NullValueHandling.Ignore,
                });

            File.WriteAllText($"C:\\Projects\\MyNutritionComrade\\test\\{product.Id}.json", result);

            Console.WriteLine(product.Label.First().Value.Value);
            return new ValueTask();
        }
    }

    public class ConsoleLogger : ILogger
    {
        private readonly string _prefix;

        public ConsoleLogger(string prefix)
        {
            _prefix = prefix;
        }

        public void Log(string message)
        {
            Console.WriteLine($"[{_prefix}] {message}");
        }
    }

    public class Program
    {
        private static async Task Main(string[] args)
        {
            var client = new HttpClient(new CachedHttpMessageHandler("C:\\Projects\\MyNutritionComrade\\test\\cache",
                new SocketsHttpHandler(), new ConsoleLogger("HTTPCLIENT")));

            var extractor = new McDonaldsExtractor();
            await extractor.RunAsync(client, new ConsoleWriter(), new ConsoleLogger("MCDONALDS"));
        }
    }

    public class CachedHttpMessageHandler : DelegatingHandler
    {
        private readonly string _directory;
        private readonly ILogger _logger;

        public CachedHttpMessageHandler(string directory, HttpMessageHandler handler, ILogger logger) : base(handler)
        {
            _directory = directory;
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

                    await File.WriteAllBytesAsync(path, await response.Content.ReadAsByteArrayAsync(),
                        cancellationToken);

                    return response;
                }

                return await base.SendAsync(request, cancellationToken);
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
