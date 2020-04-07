using System.Collections.Generic;
using MyNutritionComrade.Core.Extensions;
using Xunit;

namespace MyNutritionComrade.Core.Tests.Extensions
{
    public class EnumerableExtensionsTests
    {
        [Fact]
        public void TestYieldItem()
        {
            var item = 12;
            var enumerable = item.Yield();

            var value = Assert.Single(enumerable);
            Assert.Equal(12, value);
        }

        [Fact]
        public void TestScrambledEqualsEmptyLists()
        {
            var list1 = new List<string>();
            var list2 = new List<string>();

            Assert.True(list1.ScrambledEquals(list2));
        }

        [Fact]
        public void TestScrambledEqualsList1Empty()
        {
            var list1 = new List<string>();
            var list2 = new List<string> {"1"};

            Assert.False(list1.ScrambledEquals(list2));
        }

        [Fact]
        public void TestScrambledEqualsList2Empty()
        {
            var list1 = new List<string> {"1"};
            var list2 = new List<string>();

            Assert.False(list1.ScrambledEquals(list2));
        }

        [Fact]
        public void TestScrambledEqualsWithEqualLists()
        {
            var list1 = new List<string> {"1", "2"};
            var list2 = new List<string> {"1", "2"};

            Assert.True(list1.ScrambledEquals(list2));
        }

        [Fact]
        public void TestScrambledEqualsWithEqualScrambledLists()
        {
            var list1 = new List<string> {"2", "1"};
            var list2 = new List<string> {"1", "2"};

            Assert.True(list1.ScrambledEquals(list2));
        }

        [Fact]
        public void TestScrambledEqualsWithDifferentLists()
        {
            var list1 = new List<string> { "2", "1" };
            var list2 = new List<string> { "1", "3" };

            Assert.False(list1.ScrambledEquals(list2));
        }
    }
}
