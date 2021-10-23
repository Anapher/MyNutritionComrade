using System;
using CommunityCatalog.Core.Gateways.Services;
using CommunityCatalog.Infrastructure.Auth;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Serilog;
using Serilog.Events;
using Xunit.Abstractions;

namespace CommunityCatalog.IntegrationTests
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Startup>
    {
        private readonly ITestOutputHelper _testOutputHelper;
        private readonly MongoDbFixture _mongoDb;
        private readonly AdminOptions _adminOptions = new();

        public CustomWebApplicationFactory(MongoDbFixture mongoDb, ITestOutputHelper testOutputHelper)
        {
            _testOutputHelper = testOutputHelper;
            _mongoDb = mongoDb;
        }

        public EmailSenderMock EmailSender { get; } = new();

        public void AddAdmin(string emailAddress)
        {
            lock (_adminOptions)
            {
                _adminOptions.AdminEmailAddresses.Add(emailAddress);
            }
        }

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

            builder.ConfigureServices(services =>
            {
                services.AddSingleton<IEmailSender>(EmailSender);
                services.AddSingleton<IOptions<AdminOptions>>(new OptionsWrapper<AdminOptions>(_adminOptions));
            });
        }

        private IConfiguration StartMongoDbAndGetConfiguration()
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile(new EmbeddedFileProvider(typeof(CustomWebApplicationFactory).Assembly),
                    "appsettings.IntegrationTest.json", false, false).Build();

            configuration["MongoDb:ConnectionString"] = _mongoDb.Runner.ConnectionString;
            configuration["MongoDb:CollectionNames:ProductDocument"] = "Product-" + Guid.NewGuid().ToString("N");
            configuration["MongoDb:CollectionNames:ProductContribution"] =
                "ProductContribution-" + Guid.NewGuid().ToString("N");
            configuration["MongoDb:CollectionNames:ProductContributionVote"] =
                "ProductContributionVote-" + Guid.NewGuid().ToString("N");

            return configuration;
        }
    }
}
