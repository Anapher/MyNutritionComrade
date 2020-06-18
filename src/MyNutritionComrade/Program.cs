using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using MyNutritionComrade.Config;
using Serilog;

namespace MyNutritionComrade
{
    public static class Program
    {
        public static int Main(string[] args)
        {
            try
            {
                var host = CreateWebHostBuilder(args).Build();
                host.CreateRavenDbIndexes();
                if (Commander.ExecuteCommandLine(host, args, out var exitCode))
                    return exitCode.Value;

                host.Run();
                return 0;
            }
            catch (Exception e)
            {
                Log.Fatal(e, "Host terminated unexpectedly");
                return 1;
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args).UseStartup<Startup>().UseSerilog((hostingContext, loggerConfiguration) =>
                loggerConfiguration.ReadFrom.Configuration(hostingContext.Configuration));
    }
}
