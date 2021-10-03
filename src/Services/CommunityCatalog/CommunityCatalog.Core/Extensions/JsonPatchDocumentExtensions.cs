using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Adapters;

namespace CommunityCatalog.Core.Extensions
{
    public static class JsonPatchDocumentExtensions
    {
        public static void ApplyToWithDefaultOptions(this JsonPatchDocument document, object target)
        {
            document.ApplyTo(target, new ObjectAdapter(JsonOptions.Default.ContractResolver, error => { }));
        }
    }
}
