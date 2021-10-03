using MediatR;

namespace CommunityCatalog.Core.Requests
{
    public record LoginRequest(string EmailAddress, string Password) : IRequest<string>;
}
