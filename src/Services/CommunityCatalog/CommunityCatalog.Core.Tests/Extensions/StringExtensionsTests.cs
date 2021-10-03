using CommunityCatalog.Core.Extensions;
using Xunit;

namespace CommunityCatalog.Core.Tests.Extensions
{
    public class StringExtensionsTests
    {
        [Theory]
        [InlineData("", "")]
        [InlineData("asd", "asd")]
        [InlineData("HelloWorld", "helloWorld")]
        [InlineData("?Why", "?Why")]
        public void ToCamelCase_TestValues_IsCorrect(string original, string expected)
        {
            var actual = original.ToCamelCase();
            Assert.Equal(expected, actual);
        }
    }
}
