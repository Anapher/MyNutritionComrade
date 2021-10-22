using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Response;
using MediatR;
using MyNutritionComrade.Models;

namespace CommunityCatalog.Core.Requests
{
    public record CreateProductRequest
    (string UserId, ProductProperties Product,
        ProductMirrorInfo? MirrorInfo = null) : IRequest<CreateProductResponse>;
}
