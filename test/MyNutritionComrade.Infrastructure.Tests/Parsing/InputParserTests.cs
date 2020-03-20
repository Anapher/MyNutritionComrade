using System;
using MyNutritionComrade.Infrastructure.Parsing;
using Xunit;

namespace MyNutritionComrade.Infrastructure.Tests.Parsing
{
    public class InputParserTests
    {
        [Theory]
        [InlineData("100g potatoes", true, 100, true, "potatoes")]
        [InlineData("100 potatoes", true, 100, true, "potatoes")]
        [InlineData("5 potatoes", true, 5, false, "potatoes")]
        [InlineData("potatoes", false, 0, false, "potatoes")]
        [InlineData("500 kg potatoes", true, 500*1000, true, "potatoes")]
        [InlineData("500    g potatoes", true, 500, true, "potatoes")]
        [InlineData("50g556 potatoes", true, 50, true, "g556 potatoes")]
        [InlineData("1 Grenadine", true, 1, false, "Grenadine")]
        [InlineData("5g", true, 5, true, "")]
        [InlineData("5", true, 5, false, "")]
        [InlineData("", false, 0, false, "")]
        public void TestTryParseServingSize(string s, bool canParse, int expectedSize, bool sizeIsGram, string expectedStringLeft)
        {
            var span = s.AsSpan();
            var parser = new InputParser();
            var result = parser.TryParseServingSize(ref span, out var size);

            Assert.Equal(canParse, result);
            Assert.Equal(expectedStringLeft, span.ToString());

            if (result)
            {
                Assert.Equal(expectedSize, size.Size);
                Assert.Equal(sizeIsGram, size.IsGram);
            }
        }

        [Theory]
        [InlineData("100g potatoes", true, 100d, 3)]
        [InlineData("a1000", false, 0d, 0)]
        [InlineData("100.1asd", true, 100.1d, 5)]
        [InlineData("100,1asd", true, 100.1d, 5)]
        [InlineData("1 Milk", true, 1d, 1)]
        [InlineData("1", true, 1d, 1)]
        [InlineData("", false, 0d, 0)]
        [InlineData("1.1", true, 1.1, 3)]
        public void TestTryParseDouble(string s, bool expectSuccess, double expectedResult, int expectedPosition)
        {
            var span = s.AsSpan();
            var success = InputParser.TryParseDouble(span, out var result, out var position);

            Assert.Equal(expectSuccess, success);
            if (success)
            {
                Assert.Equal(expectedResult,result);
                Assert.Equal(expectedPosition,position);
            }
        }
    }
}
