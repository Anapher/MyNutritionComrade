using System.Threading.Tasks;

namespace CommunityCatalog.Core.Gateways.Services
{
    public interface IEmailSender
    {
        Task SendPasswordToEmail(string receiverEmailAddress, string password);
    }
}
