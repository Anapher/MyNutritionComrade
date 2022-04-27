using System;
using Extractor.Interface;

namespace ExtractorCLI
{
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
}
