using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Extractor.Interface;
using FluentValidation;
using MyNutritionComrade.Models;
using MyNutritionComrade.Models.Validation;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ExtractorCLI
{
    public class DiskWriter : IProductWriter
    {
        private readonly DirectoryInfo _outputDirectory;
        private readonly ILogger _logger;

        public DiskWriter(DirectoryInfo outputDirectory, ILogger logger)
        {
            _outputDirectory = outputDirectory;
            _logger = logger;
        }

        public JsonSerializerSettings JsonSerializerSettings { get; set; } = new()
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            NullValueHandling = NullValueHandling.Ignore,
        };

        public ValueTask Write(Product product)
        {
            var validator = new ProductValidator();
            validator.ValidateAndThrow(product);

            var properties = new ProductProperties(product.Code, product.Label, product.NutritionalInfo,
                product.Servings, product.DefaultServing, product.Tags);

            var result = JsonConvert.SerializeObject(properties, Formatting.Indented, JsonSerializerSettings);
            var targetPath = Path.Combine(_outputDirectory.FullName, $"{product.Id}.json");

            File.WriteAllText(targetPath, result);

            _logger.Log($"Saved \"${product.Label.First().Value.Value}\" to {targetPath}");
            return ValueTask.CompletedTask;
        }
    }
}
