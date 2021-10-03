using MediatR;

namespace CommunityCatalog.Core.Requests
{
    public record LoginRequestPasswordRequest(string EmailAddress) : IRequest;
}
