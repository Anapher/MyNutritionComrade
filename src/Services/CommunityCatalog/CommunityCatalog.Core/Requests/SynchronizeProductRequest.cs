using MediatR;
using MyNutritionComrade.Models;

namespace CommunityCatalog.Core.Requests
{
    public record SynchronizeProductRequest(Product Product, string IndexUrl) : IRequest;
}
