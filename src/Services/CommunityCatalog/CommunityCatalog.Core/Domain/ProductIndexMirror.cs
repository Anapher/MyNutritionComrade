using System.Collections.Generic;

namespace CommunityCatalog.Core.Domain
{
    public record ProductIndexMirror(string IndexUrl, IReadOnlyList<string> WriteableCatalogs);
}
