using System.Collections.Concurrent;
using System.Threading.Tasks;
using CommunityCatalog.Core.Gateways.Services;

namespace CommunityCatalog.IntegrationTests
{
    public class EmailSenderMock : IEmailSender
    {
        private readonly ConcurrentDictionary<string, TaskCompletionSource<string>> _waitingListForEmails = new();

        public Task SendPasswordToEmail(string receiverEmailAddress, string password)
        {
            if (_waitingListForEmails.TryRemove(receiverEmailAddress, out var source))
                source.SetResult(password);

            return Task.CompletedTask;
        }

        public Task<string> WaitForPassword(string emailAddress)
        {
            var source = new TaskCompletionSource<string>();
            _waitingListForEmails.TryAdd(emailAddress, source);

            return source.Task;
        }
    }
}
