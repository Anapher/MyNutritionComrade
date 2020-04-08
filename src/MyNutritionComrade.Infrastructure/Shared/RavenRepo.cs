using System;
using MyNutritionComrade.Infrastructure.Interfaces;
using Raven.Client.Documents;
using Raven.Client.Documents.Session;

namespace MyNutritionComrade.Infrastructure.Shared
{
    public abstract class RavenRepo : IRepository
    {
        protected readonly IDocumentStore Store;

        protected RavenRepo(IDocumentStore store)
        {
            Store = store;
        }

        protected IAsyncDocumentSession OpenReadOnlySession() => Store.OpenAsyncSession(new SessionOptions {NoTracking = true});

        protected IAsyncDocumentSession OpenWriteClusterSession() =>
            Store.OpenAsyncSession(new SessionOptions {TransactionMode = TransactionMode.ClusterWide});

        protected IAsyncDocumentSession OpenWriteSession() => Store.OpenAsyncSession();

        protected void SetGuidId(object o)
        {
            var property = o.GetType().GetProperty("Id");
            if (property == null) throw new InvalidOperationException("The Id property was not found.");

            property.SetValue(o, Guid.NewGuid().ToString("N"));
        }
    }
}
