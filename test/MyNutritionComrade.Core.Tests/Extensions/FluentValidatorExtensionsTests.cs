using System.Collections.Generic;
using FluentValidation;
using MyNutritionComrade.Core.Extensions;
using Xunit;

namespace MyNutritionComrade.Core.Tests.Extensions
{
    public class FluentValidatorExtensionsTests
    {
        public class TestClass
        {
            public string StringProp { get; set; }
            public List<string> Items { get; set; }
        }

        public class TestValidation1 : AbstractValidator<TestClass>
        {
            public TestValidation1()
            {
                RuleFor(x => x.StringProp).IsCulture();
            }
        }

        public class TestValidation2 : AbstractValidator<TestClass>
        {
            public TestValidation2()
            {
                RuleFor(x => x.StringProp).OneOf(new HashSet<string> {"a", "b", "c"});
            }
        }

        public class TestValidation3 : AbstractValidator<TestClass>
        {
            public TestValidation3()
            {
                RuleFor(x => x.Items).UniqueItems();
            }
        }

        [Fact]
        public void TestIsCultureWithValidCulture()
        {
            var obj = new TestClass {StringProp = "de"};

            var validation = new TestValidation1();
            var result = validation.Validate(obj);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void TestIsCultureWithNullCulture()
        {
            var obj = new TestClass { StringProp = null };

            var validation = new TestValidation1();
            var result = validation.Validate(obj);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void TestIsCultureWithEmptyCulture()
        {
            var obj = new TestClass { StringProp = "" };

            var validation = new TestValidation1();
            var result = validation.Validate(obj);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void TestIsCultureWithInvalidCulture()
        {
            var obj = new TestClass { StringProp = "hello world" };

            var validation = new TestValidation1();
            var result = validation.Validate(obj);
            Assert.False(result.IsValid);
        }

        [Fact]
        public void TestOneOfWithValidValue()
        {
            var obj = new TestClass { StringProp = "a" };

            var validation = new TestValidation2();
            var result = validation.Validate(obj);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void TestOneOfWithNullValue()
        {
            var obj = new TestClass { StringProp = null };

            var validation = new TestValidation2();
            var result = validation.Validate(obj);
            Assert.False(result.IsValid);
        }

        [Fact]
        public void TestOneOfWithEmptyValue()
        {
            var obj = new TestClass { StringProp = "" };

            var validation = new TestValidation2();
            var result = validation.Validate(obj);
            Assert.False(result.IsValid);
        }

        [Fact]
        public void TestOneOfWithInvalidValue()
        {
            var obj = new TestClass { StringProp = "d" };

            var validation = new TestValidation2();
            var result = validation.Validate(obj);
            Assert.False(result.IsValid);
        }

        [Fact]
        public void TestUniqueItemsWithSingleItem()
        {
            var obj = new TestClass {Items = new List<string> {"a"}};

            var validation = new TestValidation3();
            var result = validation.Validate(obj);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void TestUniqueItemsWithMultipleValidItems()
        {
            var obj = new TestClass { Items = new List<string> { "a", "b", "c" } };

            var validation = new TestValidation3();
            var result = validation.Validate(obj);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void TestUniqueItemsWithNull()
        {
            var obj = new TestClass { Items = null };

            var validation = new TestValidation3();
            var result = validation.Validate(obj);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void TestUniqueItemsWithEmptyList()
        {
            var obj = new TestClass { Items = new List<string>() };

            var validation = new TestValidation3();
            var result = validation.Validate(obj);
            Assert.True(result.IsValid);
        }

        [Fact]
        public void TestUniqueItemsWithDuplicateList()
        {
            var obj = new TestClass { Items = new List<string>{"a", "a", "b"} };

            var validation = new TestValidation3();
            var result = validation.Validate(obj);
            Assert.False(result.IsValid);
        }
    }
}
