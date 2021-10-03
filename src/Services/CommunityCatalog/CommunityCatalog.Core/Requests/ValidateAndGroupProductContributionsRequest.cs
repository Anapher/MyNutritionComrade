using System.Collections.Generic;
using CommunityCatalog.Core.Services;
using MediatR;
using Microsoft.AspNetCore.JsonPatch.Operations;

namespace CommunityCatalog.Core.Requests
{
    public record ValidateAndGroupProductContributionsRequest
        (string ProductId, IReadOnlyList<Operation> Operations) : IRequest<IReadOnlyList<ProductOperationsGroup>>;
}
