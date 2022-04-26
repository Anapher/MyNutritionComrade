using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using MyNutritionComrade.Models;

namespace Extractors.McDonalds
{
    internal class ProductNameServingParser
    {
        public static bool TryParseServing(Product product, [NotNullWhen(true)] out ParsedServingSize? servingSize)
        {
            var name = product.Label.Single().Value.Value;

            var servingSizes = new Dictionary<string, ParsedSizeMatch.ParsedSize>(StringComparer.OrdinalIgnoreCase)
            {
                { "groß", ParsedSizeMatch.ParsedSize.Large },
                { "mittel", ParsedSizeMatch.ParsedSize.Medium },
                { "klein", ParsedSizeMatch.ParsedSize.Small },
                { "Regular", ParsedSizeMatch.ParsedSize.Medium },
                { "Grande", ParsedSizeMatch.ParsedSize.Large },
                { "Small", ParsedSizeMatch.ParsedSize.Small },
            };

            var sizeMatch = Regex.Match(name, $"^(.+) ({string.Join('|', servingSizes.Keys)})$",
                RegexOptions.IgnoreCase);
            if (sizeMatch.Success)
            {
                servingSize = new ParsedSizeMatch(sizeMatch.Groups[1].Value, servingSizes[sizeMatch.Groups[2].Value]);
                return true;
            }

            var numberMatch = Regex.Match(name, "^([0-9]+) (.+)$");
            if (numberMatch.Success)
            {
                servingSize =
                    new ParsedAmountServing(numberMatch.Groups[2].Value, int.Parse(numberMatch.Groups[1].Value));

                return true;
            }

            var liquidMatch = Regex.Match(name, @"^(.+) 0,([0-9]+)\W*l$");
            if (liquidMatch.Success)
            {
                servingSize = new ParsedLiquidAmount(liquidMatch.Groups[1].Value,
                    (int)(double.Parse("0." + liquidMatch.Groups[2].Value, CultureInfo.InvariantCulture) * 1000));

                return true;
            }

            servingSize = null;
            return false;
        }
    }

    public abstract class ParsedServingSize
    {
        public abstract string NewName { get; }
    }

    public class ParsedAmountServing : ParsedServingSize
    {
        public ParsedAmountServing(string newName, int amount)
        {
            NewName = newName;
            Amount = amount;
        }

        public override string NewName { get; }
        public int Amount { get; }
    }

    public class ParsedSizeMatch : ParsedServingSize
    {
        public enum ParsedSize
        {
            Small,
            Medium,
            Large,
        }

        public ParsedSizeMatch(string newName, ParsedSize size)
        {
            NewName = newName;
            Size = size;
        }

        public override string NewName { get; }
        public ParsedSize Size { get; }
    }

    public class ParsedLiquidAmount : ParsedServingSize
    {
        public ParsedLiquidAmount(string newName, int amountInMl)
        {
            NewName = newName;
            AmountInMl = amountInMl;
        }

        public override string NewName { get; }
        public int AmountInMl { get; }
    }
}
