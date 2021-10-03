namespace CommunityCatalog.Core.Gateways.Services
{
    public interface ITokenFactory
    {
        string GenerateToken(int size = 32);
    }
}