using CommandLine;

namespace ProductIndexCLI.Runners
{
    [Verb("build", HelpText = "Build the product index")]
    public class BuilderOptions
    {
        [Option('o', "output", Required = true, HelpText = "The output directory where to put the index files.")]
        public string OutputDirectory { get; set; }

        [Option('i', "input", Required = true, HelpText = "The input directory containing the product json files")]
        public string SourceDirectory { get; set; }
    }
}
