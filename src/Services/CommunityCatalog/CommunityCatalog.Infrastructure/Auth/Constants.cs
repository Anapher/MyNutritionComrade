namespace CommunityCatalog.Infrastructure.Auth
{
    public static class Constants
    {
        public static class Strings
        {
            public static class JwtClaimIdentifiers
            {
                public const string Rol = "rol", Id = "id";
            }

            public static class JwtRoles
            {
                public const string User = "user";
                public const string Admin = "admin";
            }
        }
    }
}
