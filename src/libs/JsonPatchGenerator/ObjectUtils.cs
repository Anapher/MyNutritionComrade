namespace JsonPatchGenerator
{
    internal static class ObjectUtils
    {
        public static string? GetKey(this object obj)
        {
            var prop = obj.GetType().GetProperty("Key");
            if (prop == null) return null;

            return (string) prop.GetValue(obj);
        }
    }
}
