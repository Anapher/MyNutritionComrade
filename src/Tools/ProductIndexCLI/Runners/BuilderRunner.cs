using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using MyNutritionComrade.Models;
using MyNutritionComrade.Models.Index;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ProductIndexCLI.Runners
{
    public class BuilderRunner
    {
        public static int RunAndReturnExitCode(BuilderOptions options)
        {
            var outputDirectory = new DirectoryInfo(options.OutputDirectory);
            outputDirectory.Create();

            var productsDirectory = new DirectoryInfo(options.SourceDirectory);
            if (!productsDirectory.Exists)
            {
                Console.WriteLine($"The directory {productsDirectory.FullName} does not exist");
                return 1;
            }

            var repos = new List<RepositoryReference>
            {
                CreateRepository(productsDirectory, outputDirectory, "products"),
            };

            foreach (var directory in productsDirectory.GetDirectories("*", SearchOption.AllDirectories))
            {
                var name = GetRepositoryName(directory.FullName, productsDirectory.FullName);
                repos.Add(CreateRepository(directory, outputDirectory, name));
            }

            CreateIndexFile(repos, outputDirectory);

            return 0;
        }

        private static string GetRepositoryName(string directoryPath, string rootDirectoryPath)
        {
            var relativePath = directoryPath.Substring(rootDirectoryPath.Length);
            var trimmed = relativePath.Trim(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
            var noPathSeparator = trimmed.Replace(Path.DirectorySeparatorChar, '-')
                .Replace(Path.AltDirectorySeparatorChar, '-');

            return $"products-{noPathSeparator}";
        }

        private static RepositoryReference CreateRepository(DirectoryInfo directory, DirectoryInfo outputDirectory,
            string productRepositoryName)
        {
            var allProducts = new List<Product>();

            Console.WriteLine($"[{productRepositoryName}] Process directory {directory.FullName}");

            var maxTimestamp = DateTimeOffset.MinValue;
            foreach (var productFile in directory.GetFiles("*", SearchOption.TopDirectoryOnly))
            {
                Product product;
                try
                {
                    product = ValidatorRunner.ValidateFile(productFile);
                }
                catch (Exception)
                {
                    Console.WriteLine($"Error occurred validating file {productFile.FullName}, skip");
                    continue;
                }

                product = PatchProduct(product);
                allProducts.Add(product);

                maxTimestamp = MaxDateTime(maxTimestamp, productFile.LastWriteTimeUtc);
            }

            Console.WriteLine(
                $"{allProducts.Count} products are valid and will be available in {productRepositoryName}.");

            var filename = $"{productRepositoryName}.json";
            var path = Path.Combine(outputDirectory.FullName, $"{productRepositoryName}.json");

            SerializeToFile(path, allProducts);

            Console.WriteLine($"Products -> {filename} ({new FileInfo(path).Length / 1024} KiB)");

            return new RepositoryReference("../" + filename, maxTimestamp);
        }

        private static void CreateIndexFile(IReadOnlyList<RepositoryReference> repos, DirectoryInfo outputDirectory)
        {
            var indexFile = new FileInfo(Path.Combine(outputDirectory.FullName, "index.json"));
            SerializeToFile(indexFile.FullName, repos);

            Console.WriteLine($"Created file {indexFile.Name}");
        }

        private static void SerializeToFile<T>(string filename, T data)
        {
            var result = JsonConvert.SerializeObject(data, Formatting.None,
                new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });

            File.WriteAllText(filename, result);
        }

        public static Product PatchProduct(Product product)
        {
            if (product.Tags is { Count: 0 })
            {
                product = product with { Tags = null };
            }

            product = product with
            {
                Label = product.Label.ToDictionary(x => x.Key,
                    x => x.Value with { Tags = x.Value.Tags?.Length == 0 ? null : x.Value.Tags }),
            };

            return product;
        }

        private static DateTimeOffset MaxDateTime(DateTimeOffset d1, DateTimeOffset d2)
        {
            return d1 > d2 ? d1 : d2;
        }
    }
}
