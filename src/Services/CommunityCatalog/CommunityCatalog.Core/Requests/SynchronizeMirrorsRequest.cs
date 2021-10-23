using System.Collections.Generic;
using CommunityCatalog.Core.Domain;
using MediatR;

namespace CommunityCatalog.Core.Requests
{
    public record SynchronizeMirrorsRequest(IReadOnlyList<ProductIndexMirror> Mirrors) : IRequest<Unit>;
}
