using CommandLine;

namespace ExtractorCLI
{
    public class Options
    {
        [Option('o', "output", Required = true,
            HelpText = "The root directory where the extracted product information should be put")]
        public string OutputDirectory { get; set; }

        [Option("cache", Required = false, HelpText = "The cache directory for http requests")]
        public string CacheDirectory { get; set; } = ".cache";

        [Option("disable-cache", Required = false, HelpText = "Disable caching of http requests")]
        public bool DisableCache { get; set; }
    }
}
