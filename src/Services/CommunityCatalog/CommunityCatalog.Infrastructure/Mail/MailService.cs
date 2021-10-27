using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;

namespace CommunityCatalog.Infrastructure.Mail
{
    public record MailRequest(string ToEmail, string Subject, string Body);

    public interface IMailService
    {
        Task SendEmailAsync(MailRequest mailRequest);
    }

    public class MailService : IMailService
    {
        private readonly MailOptions _options;

        public MailService(IOptions<MailOptions> options)
        {
            _options = options.Value;
        }

        public async Task SendEmailAsync(MailRequest mailRequest)
        {
            var message = CreateMimeMessage(mailRequest);

            using var smtpClient = new SmtpClient();

            await smtpClient.ConnectAsync(_options.Host, _options.Port, SecureSocketOptions.StartTls);
            await smtpClient.AuthenticateAsync(_options.Mail, _options.Password);
            await smtpClient.SendAsync(message);

            await smtpClient.DisconnectAsync(true);
        }

        private MimeMessage CreateMimeMessage(MailRequest mailRequest)
        {
            var email = new MimeMessage { Sender = MailboxAddress.Parse(_options.Mail) };
            email.To.Add(MailboxAddress.Parse(mailRequest.ToEmail));
            email.Subject = mailRequest.Subject;

            email.Body = new TextPart(TextFormat.Plain) { Text = mailRequest.Body };

            return email;
        }
    }
}
