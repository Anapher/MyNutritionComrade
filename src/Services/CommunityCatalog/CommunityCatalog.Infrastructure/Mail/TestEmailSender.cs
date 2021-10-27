using System;
using System.Threading.Tasks;
using CommunityCatalog.Core.Gateways.Services;

namespace CommunityCatalog.Infrastructure.Mail
{
    public class TestEmailSender : IEmailSender
    {
        public Task SendPasswordToEmail(string receiverEmailAddress, string password)
        {
            Console.WriteLine($"[Email to {receiverEmailAddress}]: {password}");
            return Task.CompletedTask;
        }
    }
}
