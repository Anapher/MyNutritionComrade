using System.Linq;

namespace MyNutritionComrade.Core.Extensions
{
    public static class StringExtensions
    {
        public static string NormalizeString(this string s) => new string(s.Where(char.IsLetterOrDigit).Select(char.ToUpperInvariant).ToArray());
    }
}
