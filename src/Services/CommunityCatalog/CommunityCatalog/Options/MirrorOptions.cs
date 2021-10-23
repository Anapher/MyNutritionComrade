using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using CommunityCatalog.Core.Domain;

namespace CommunityCatalog.Options
{
    public class MirrorOptions
    {
        public IReadOnlyList<ProductIndexMirror> Indexes { get; set; } = ImmutableList<ProductIndexMirror>.Empty;

        public TimeSpan PollFrequency { get; set; } = TimeSpan.FromHours(24);
    }
}