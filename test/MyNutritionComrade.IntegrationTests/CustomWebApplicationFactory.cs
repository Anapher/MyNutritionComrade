using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using MyNutritionComrade.Config;
using Raven.Client.Documents;
using Raven.Client.Documents.Session;
using Raven.TestDriver;

namespace MyNutritionComrade.IntegrationTests
{
    public class TestDriver : RavenTestDriver
    {
        public IDocumentStore Create()
        {
            var store = GetDocumentStore();
            store.OnBeforeQuery += StoreOnOnBeforeQuery;

            return store;
        }

        private void StoreOnOnBeforeQuery(object? sender, BeforeQueryEventArgs e)
        {
            // very important so we have deterministic results
            e.QueryCustomization.WaitForNonStaleResults();
        }
    }

    public class CustomWebApplicationFactory : WebApplicationFactory<Startup>
    {
        private readonly TestDriver _testDriver = new TestDriver();

        public TestGoogleAuthValidator GoogleAuthValidator { get; } = new TestGoogleAuthValidator();

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                // Remove the app's IDocumentStore registration.
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IDocumentStore));
                if (descriptor != null)
                    services.Remove(descriptor);

                services.AddSingleton<IDocumentStore>(_testDriver.Create());

                descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IGoogleAuthValidator));
                if (descriptor != null)
                    services.Remove(descriptor);

                services.AddSingleton<IGoogleAuthValidator>(GoogleAuthValidator);
            });
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _testDriver.Dispose();
        }
    }

    public class TestGoogleAuthValidator : IGoogleAuthValidator
    {
        public ConcurrentDictionary<string, GoogleJsonWebSignature.Payload> ValidLogins { get; } =
            new ConcurrentDictionary<string, GoogleJsonWebSignature.Payload>();

        public Task<GoogleJsonWebSignature.Payload> ValidateAsync(string idToken)
        {
            if (ValidLogins.TryGetValue(idToken, out var payload))
                return Task.FromResult(payload);

            throw new InvalidJwtException("fail");
        }
    }
}
