using System.Collections.Generic;

namespace CommunityCatalog.Infrastructure.Mirrors
{
    public record ProductIndexMirror(string IndexUrl, IReadOnlyList<string> WriteableCatalogs);
}
