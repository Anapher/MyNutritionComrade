using System;
using System.Diagnostics.CodeAnalysis;

namespace MyNutritionComrade.Core.Interfaces.Services
{
    public interface IInputParser
    {
        /// <summary>
        ///     Try to parse a serving from a string, e. g. "100g something".
        /// </summary>
        /// <param name="s">The input string</param>
        /// <param name="size">The result</param>
        /// <returns>Return true if a serving could be parsed from the beginning of the string</returns>
        bool TryParseServingSize(ref ReadOnlySpan<char> s, [NotNullWhen(true)] out ServingSize? size);
    }
}