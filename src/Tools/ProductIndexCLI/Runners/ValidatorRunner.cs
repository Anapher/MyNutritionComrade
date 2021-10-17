using System;
using System.IO;
using FluentValidation;
using MyNutritionComrade.Models;
using MyNutritionComrade.Models.Validation;
using Newtonsoft.Json;

namespace ProductIndexCLI.Runners
{
    public class ValidatorRunner
    {
        public static int RunAndReturnExitCode(ValidatorOptions options)
        {
            var directory = new DirectoryInfo(options.SourceDirectory);

            var success = true;
            var validatedCounter = 0;

            foreach (var file in directory.EnumerateFiles("*.json"))
            {
                try
                {
                    ValidateFile(file);
                    validatedCounter++;
                }
                catch (Exception e)
                {
                    Console.WriteLine($"Validation failed for file '{file.FullName}'");
                    Console.WriteLine(e);
                    success = false;
                }
            }

            Console.WriteLine($"Found {validatedCounter} valid files");
            return success ? 0 : 1;
        }

        public static ProductProperties ValidateFile(FileInfo file)
        {
            var validator = new ProductPropertiesValidator();
            var jsonText = File.ReadAllText(file.FullName);

            var obj = JsonConvert.DeserializeObject<ProductProperties>(jsonText);

            if (obj == null)
            {
                throw new NullReferenceException("The object is null");
            }

            validator.ValidateAndThrow(obj);

            return obj;
        }
    }
}
