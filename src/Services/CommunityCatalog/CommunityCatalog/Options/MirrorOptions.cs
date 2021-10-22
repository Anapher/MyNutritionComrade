using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using CommunityCatalog.Infrastructure.Mirrors;

namespace CommunityCatalog.Options
{
    public class MirrorOptions
    {
        public IReadOnlyList<ProductIndexMirror> Indexes { get; set; } = ImmutableList<ProductIndexMirror>.Empty;

        public TimeSpan PollFrequency { get; set; } = TimeSpan.FromHours(24);
    }
}