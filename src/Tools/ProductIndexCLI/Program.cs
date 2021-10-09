using CommandLine;
using ProductIndexCLI.Runners;

namespace ProductIndexCLI
{
    public class Program
    {
        public static int Main(string[] args)
        {
            return Parser.Default.ParseArguments<BuilderOptions, ValidatorOptions>(args).MapResult(
                (BuilderOptions options) => BuilderRunner.RunAndReturnExitCode(options),
                (ValidatorOptions options) => ValidatorRunner.RunAndReturnExitCode(options), _ => 1);
        }
    }
}
