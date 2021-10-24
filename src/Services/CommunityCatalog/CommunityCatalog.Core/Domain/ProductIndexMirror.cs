using System;

namespace CommunityCatalog.Core.Domain
{
    public class ProductIndexMirror
    {
        public ProductIndexMirror()
        {
        }

        public ProductIndexMirror(string indexUrl, string[] writeableCatalogs)
        {
            IndexUrl = indexUrl;
            WriteableCatalogs = writeableCatalogs;
        }

        public string IndexUrl { get; set; } = string.Empty;
        public string[] WriteableCatalogs { get; set; } = Array.Empty<string>();
    }
}
