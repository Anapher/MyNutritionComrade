using CommandLine;

namespace ProductIndexCLI.Runners
{
    [Verb("validate", HelpText = "Validate product files in a directory")]
    public class ValidatorOptions
    {
        [Option('i', "input", Required = true, HelpText = "The input directory containing the product json files")]
        public string SourceDirectory { get; set; }
    }
}
