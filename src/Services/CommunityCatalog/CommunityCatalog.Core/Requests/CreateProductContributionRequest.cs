using CommunityCatalog.Core.Services;
using MediatR;

namespace CommunityCatalog.Core.Requests
{
    public record CreateProductContributionRequest
        (string UserId, string ProductId, ProductOperationsGroup Changes) : IRequest<string>;
}
