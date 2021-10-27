using System.Threading.Tasks;
using CommunityCatalog.Core.Gateways.Services;

namespace CommunityCatalog.Infrastructure.Mail
{
    public class RealEmailSender : IEmailSender
    {
        private readonly IMailService _mailService;

        public RealEmailSender(IMailService mailService)
        {
            _mailService = mailService;
        }

        public Task SendPasswordToEmail(string receiverEmailAddress, string password)
        {
            return _mailService.SendEmailAsync(new MailRequest(receiverEmailAddress, "MyNutritionComrade Password",
                GetMessageBody(password)));
        }

        private static string GetMessageBody(string password)
        {
            return $@"Hello,
we've received a request to send you your password for MyNutritionComrade.

{password}

Please note that this password is only valid for a short amount of time. You can always request a new one.

- MyNutritionComrade";
        }
    }
}
