using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using MyNutritionComrade.Core.Interfaces.Services;

namespace MyNutritionComrade.Infrastructure.Parsing
{
    public class InputParser : IInputParser
    {
        // we allow dot aswell as comma as decimal separator
        private static readonly IImmutableDictionary<char, NumberFormatInfo> DecimalSeparators =
            new Dictionary<char, NumberFormatInfo> {{'.', NumberFormatInfo.InvariantInfo}, {',', new NumberFormatInfo {NumberDecimalSeparator = ","}}}
                .ToImmutableDictionary();

        /// <summary>
        ///     Try to parse a double at the beginning of a string. Dot and comma are allowed as decimal separator. 
        /// </summary>
        /// <param name="s">The string which may start with a double</param>
        /// <param name="result">The parsed number if one is found</param>
        /// <param name="position">The resulting position in the string</param>
        /// <returns>Return true if a number could be parsed from the beginning of a string</returns>
        /// <example>TryParseDouble("485.45 hello world", ...) results in 485.45 as result and the position is the first whitespace</example>
        public static bool TryParseDouble(ReadOnlySpan<char> s, [NotNullWhen(true)] out double result, out int position)
        {
            position = 0;
            while (s.Length > position && char.IsNumber(s[position]))
                position++;

            if (position == 0)
            {
                result = default;
                return false;
            }

            if (s.Length > position && DecimalSeparators.TryGetValue(s[position], out var numberFormat))
            {
                position++;
                while (s.Length > position && char.IsNumber(s[position]))
                    position++;

                result = double.Parse(s.Slice(0, position), NumberStyles.Any, numberFormat);
                return true;
            }

            result = double.Parse(s.Slice(0, position), NumberStyles.Any, NumberFormatInfo.InvariantInfo);
            return true;
        }

        /// <summary>
        ///     Try to parse a serving from a string, e. g. "100g something".
        /// </summary>
        /// <param name="s">The input string</param>
        /// <param name="size">The result</param>
        /// <returns>Return true if a serving could be parsed from the beginning of the string</returns>
        public bool TryParseServingSize(ref ReadOnlySpan<char> s, [NotNullWhen(true)] out ServingSize? size)
        {
            if (!TryParseDouble(s, out var servingSize, out var position))
            {
                size = null;
                return false;
            }

            s = s.Slice(position).TrimStart();

            if (s.Length > 0 && ParseServingUnit(s, servingSize, out var result, out position))
            {
                size = result;
                s = s.Slice(position).TrimStart();
                return true;
            }

            size = CreateDefaultServing(servingSize);
            return true;
        }

        /// <summary>
        ///     Try to parse a unit of a serving. 
        /// </summary>
        /// <param name="x"></param>
        /// <param name="size"></param>
        /// <param name="result"></param>
        /// <param name="position"></param>
        /// <returns>Return true if a unit could be parsed</returns>
        private static bool ParseServingUnit(ReadOnlySpan<char> x, double size, [NotNullWhen(true)] out ServingSize? result, out int position)
        {
            position = 0;
            result = null;

            if (x[0] == 'g')
            {
                result = new ServingSize(size, true);
                position = 1;
            }
            else if (x.StartsWith("kg"))
            {
                result = new ServingSize(size * 1000, true);
                position = 2;
            }
            else if (x.StartsWith("lb"))
            {
                result = new ServingSize(size * 453.5924, true);
                position = 2;
            }

            if (position > 0 && (x.Length == position || char.IsWhiteSpace(x[position])))
                return true;

            position = 0;
            return false;
        }

        /// <summary>
        ///     Create a default serving from a size
        /// </summary>
        /// <param name="size">The size</param>
        /// <returns>Return the serving that represents the size</returns>
        private static ServingSize CreateDefaultServing(double size)
        {
            // there is no unit given, e. g. "100 potatoes" or "2 potatoes". If the size exceeds 50 (like the first example),
            // we assume gram is meant, else we assume that "pieces/servings" are meant
            return new ServingSize(size, size >= 50);
        }
    }
}
