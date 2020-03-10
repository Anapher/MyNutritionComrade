using System.Collections.Generic;

namespace JsonPatchGenerator
{
    internal sealed class KeyEqualityComparer : IEqualityComparer<KeyValuePair<string, object>>
    {
        public static IEqualityComparer<KeyValuePair<string, object>> Instance { get; } = new KeyEqualityComparer();

        public bool Equals(KeyValuePair<string, object> x, KeyValuePair<string, object> y)
        {
            if (ReferenceEquals(x.Key, y.Key)) return true;
            if (ReferenceEquals(x.Key, null)) return false;
            if (ReferenceEquals(y.Key, null)) return false;
            return x.Key == y.Key;
        }

        public int GetHashCode(KeyValuePair<string, object> obj) => obj.Key != null ? obj.Key.GetHashCode() : 0;
    }
}
