using System;
using Mongo2Go;

namespace CommunityCatalog.IntegrationTests
{
    public class MongoDbFixture : IDisposable
    {
        public MongoDbFixture()
        {
            Runner = MongoDbRunner.Start(null, null, null, true);
        }

        public void Dispose()
        {
            Runner.Dispose();
        }

        public MongoDbRunner Runner { get; }
    }
}
