using System.Net.Http;
using System.Threading.Tasks;

namespace Extractor.Interface
{
    public interface IExtractor
    {
        Task RunAsync(HttpClient client, IProductWriter writer, ILogger logger);
    }
}
