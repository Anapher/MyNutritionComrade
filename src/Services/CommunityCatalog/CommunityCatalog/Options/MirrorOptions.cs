using System;
using CommunityCatalog.Core.Domain;

namespace CommunityCatalog.Options
{
    public class MirrorOptions
    {
        public ProductIndexMirror[] Indexes { get; set; } = Array.Empty<ProductIndexMirror>();

        public TimeSpan PollFrequency { get; set; } = TimeSpan.FromHours(24);
    }
}
