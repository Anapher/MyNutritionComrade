using System;

namespace CommunityCatalog.Core.Options
{
    public class IdentityOptions
    {
        public static readonly DateTimeOffset EpocheStart = DateTimeOffset.Parse("2021-10-03T10:22:40+0000");

        public string EmailSalt { get; set; } = "test";

        public int PasswordValidForHours { get; set; } = 4;

        public string SecretKey { get; set; } = "test";
    }
}
