using CommunityCatalog.Core.Gateways.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Serilog;
using Serilog.Events;
using Xunit.Abstractions;

namespace CommunityCatalog.IntegrationTests
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Startup>
    {
        private readonly ITestOutputHelper _testOutputHelper;
        private readonly MongoDbFixture _mongoDb;

        public CustomWebApplicationFactory(MongoDbFixture mongoDb, ITestOutputHelper testOutputHelper)
        {
            _testOutputHelper = testOutputHelper;
            _mongoDb = mongoDb;
        }

        public EmailSenderMock EmailSender { get; } = new();

        protected override IWebHostBuilder CreateWebHostBuilder()
        {
            return base.CreateWebHostBuilder().UseSerilog(GetLoggerConfig().CreateLogger());
        }

        private LoggerConfiguration GetLoggerConfig()
        {
            return new LoggerConfiguration().WriteTo.TestOutput(_testOutputHelper, LogEventLevel.Debug).MinimumLevel
                .Debug();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            var configuration = StartMongoDbAndGetConfiguration();

            builder.ConfigureAppConfiguration(configurationBuilder =>
                configurationBuilder.AddConfiguration(configuration));

            builder.ConfigureServices(services => { services.AddSingleton<IEmailSender>(EmailSender); });
        }

        private IConfiguration StartMongoDbAndGetConfiguration()
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile(new EmbeddedFileProvider(typeof(CustomWebApplicationFactory).Assembly),
                    "appsettings.IntegrationTest.json", false, false).Build();

            configuration["MongoDb:ConnectionString"] = _mongoDb.Runner.ConnectionString;
            return configuration;
        }
    }
}
