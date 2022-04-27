using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using CommandLine;
using Extractors.McDonalds;

namespace ExtractorCLI
{
    public class Program
    {
        private static Task Main(string[] args)
        {
            return Parser.Default.ParseArguments<Options>(args).WithParsedAsync(RunExtractor);
        }

        private static async Task RunExtractor(Options options)
        {
            var outputDirectory = new DirectoryInfo(options.OutputDirectory);
            outputDirectory.Create();

            var httpHandler = CreateHttpMessageHandler(options);
            var client = new HttpClient(httpHandler);

            var extractor = new McDonaldsExtractor();
            await extractor.RunAsync(client, new DiskWriter(outputDirectory, new ConsoleLogger("DISKWRITER")),
                new ConsoleLogger("MCDONALDS"));
        }

        private static HttpMessageHandler CreateHttpMessageHandler(Options options)
        {
            HttpMessageHandler handler = new SocketsHttpHandler();
            var logger = new ConsoleLogger("HTTPCLIENT");

            if (!options.DisableCache)
            {
                handler = new CachedHttpMessageHandler(options.CacheDirectory, handler, logger);
            }

            handler = new RetryHttpMessageHandler(handler, logger);

            return handler;
        }
    }
}
