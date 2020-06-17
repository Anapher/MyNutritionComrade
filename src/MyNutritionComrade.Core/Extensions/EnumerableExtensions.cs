using System.Collections.Generic;
using System.Linq;

namespace MyNutritionComrade.Core.Extensions
{
    public static class EnumerableExtensions
    {
        public static IEnumerable<T> Yield<T>(this T item)
        {
            yield return item;
        }

        public static bool ScrambledEquals<T>(this IEnumerable<T> list1, IEnumerable<T> list2) where T : notnull
        {
            var cnt = new Dictionary<T, int>();
            foreach (var s in list1)
                if (cnt.ContainsKey(s))
                    cnt[s]++;
                else
                    cnt.Add(s, 1);
            foreach (var s in list2)
                if (cnt.ContainsKey(s))
                    cnt[s]--;
                else
                    return false;
            return cnt.Values.All(c => c == 0);
        }

        public static int ScrambledHashCode<T>(this IEnumerable<T> list) where T : notnull
        {
            unchecked
            {
                return list.OrderBy(x => x).Aggregate(17, (result, current) => result * 31 + current.GetHashCode());
            }
        }
    }
}
