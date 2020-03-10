using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Xunit;

namespace JsonPatchGenerator.Tests
{
    public class JsonPatchFactoryTests
    {
        public class TestClass1
        {
            public string Prop1 { get; set; }
            public int Prop2 { get; set; }
            public bool Prop3 { get; set; }
        }

        public class TestClass2
        {
            public TestClass1 Prop1 { get; set; }
            public string Prop2 { get; set; }
        }

        public class KeyedObject
        {
            public string Key { get; set; }
            public string Value { get; set; }
        }

        public class TestClass3
        {
            public List<KeyedObject> Prop1 { get; set; }
            public string Prop2 { get; set; }
        }

        public class TestClass4
        {
            public List<TestClass1> Prop1 { get; set; }
        }

        [Fact]
        public void TestCreatePatchFlatObject()
        {
            // arrange
            var obj = new TestClass1 {Prop1 = "Hallo Welt", Prop2 = 34, Prop3 = false};
            var newObj = new TestClass1 {Prop1 = "Hello World", Prop2 = 34, Prop3 = false};

            // act
            var patch = JsonPatchFactory.CreatePatch(obj, newObj);

            // assert
            var op = Assert.Single(patch.Operations);
            Assert.Equal(OperationType.Replace, op.OperationType);
            Assert.Equal("/Prop1", op.path);
            Assert.Equal("Hello World", op.value.ToString());
        }

        [Fact]
        public void TestCreatePatchFlatObjectMultipleValues()
        {
            // arrange
            var obj = new TestClass1 { Prop1 = "Hallo Welt", Prop2 = 34, Prop3 = false };
            var newObj = new TestClass1 { Prop1 = "Hallo Welt", Prop2 = 43, Prop3 = true };

            // act
            var patch = JsonPatchFactory.CreatePatch(obj, newObj);

            // assert
            Assert.Collection(patch.Operations.OrderBy(x => x.path), op =>
            {
                Assert.Equal(OperationType.Replace, op.OperationType);
                Assert.Equal("/Prop2", op.path);
                Assert.Equal("43", op.value.ToString());
            }, op =>
            {
                Assert.Equal(OperationType.Replace, op.OperationType);
                Assert.Equal("/Prop3", op.path);
                Assert.Equal("True", op.value.ToString());
            });
        }

        [Fact]
        public void TestCreatePatchDeepObjectMultipleValues()
        {
            // arrange
            var obj = new TestClass2 {Prop1 = new TestClass1 {Prop1 = "Hallo Welt", Prop2 = 34, Prop3 = false}, Prop2 = "asd"};
            var newObj = new TestClass2 { Prop1 = new TestClass1 { Prop1 = "Hello Welt", Prop2 = 34, Prop3 = false }, Prop2 = "das" };

            // act
            var patch = JsonPatchFactory.CreatePatch(obj, newObj);

            // assert
            Assert.Collection(patch.Operations.OrderBy(x => x.path), op =>
            {
                Assert.Equal(OperationType.Replace, op.OperationType);
                Assert.Equal("/Prop1/Prop1", op.path);
                Assert.Equal("Hello Welt", op.value.ToString());
            }, op =>
            {
                Assert.Equal(OperationType.Replace, op.OperationType);
                Assert.Equal("/Prop2", op.path);
                Assert.Equal("das", op.value.ToString());
            });
        }

        [Fact]
        public void TestCreatePatchFlatListAddItem()
        {
            // arrange
            var obj = new TestClass3 {Prop1 = new List<KeyedObject>()};
            var newObj = new TestClass3 {Prop1 = new List<KeyedObject> {new KeyedObject {Key = "1", Value = "Hello"}}};

            // act
            var patch = JsonPatchFactory.CreatePatch(obj, newObj);

            // assert
            Assert.Collection(patch.Operations.OrderBy(x => x.path), op =>
            {
                Assert.Equal(OperationType.Add, op.OperationType);
                Assert.Equal("/Prop1", op.path);

                Assert.Equal(@"{
  ""Key"": ""1"",
  ""Value"": ""Hello""
}", op.value.ToString());
            });
        }

        [Fact]
        public void TestCreatePatchFlatListRemoveItem()
        {
            // arrange
            var obj = new TestClass3
            {
                Prop1 = new List<KeyedObject> {new KeyedObject {Key = "1", Value = "Corona"}, new KeyedObject {Key = "2", Value = "Pls dont kill me"}}
            };
            var newObj = new TestClass3 {Prop1 = new List<KeyedObject> {new KeyedObject {Key = "1", Value = "Corona"}}};

            // act
            var patch = JsonPatchFactory.CreatePatch(obj, newObj);

            // assert
            Assert.Collection(patch.Operations.OrderBy(x => x.path), op =>
            {
                Assert.Equal(OperationType.Remove, op.OperationType);
                Assert.Equal("/Prop1/2", op.path);
            });
        }

        [Fact]
        public void TestCreatePatchFlatListPatchItem()
        {
            // arrange
            var obj = new TestClass3
            {
                Prop1 = new List<KeyedObject> { new KeyedObject { Key = "1", Value = "Corona" }, new KeyedObject { Key = "2", Value = "Pls dont kill me" } }
            };
            var newObj = new TestClass3 { Prop1 = new List<KeyedObject> { new KeyedObject { Key = "1", Value = "Corona" }, new KeyedObject { Key = "2", Value = "Plx dont kill me" } } };

            // act
            var patch = JsonPatchFactory.CreatePatch(obj, newObj);

            // assert
            Assert.Collection(patch.Operations.OrderBy(x => x.path), op =>
            {
                Assert.Equal(OperationType.Replace, op.OperationType);
                Assert.Equal("/Prop1/2/Value", op.path);
                Assert.Equal("Plx dont kill me", op.value.ToString());
            });
        }

        [Fact]
        public void TestCreatePatchListWithoutKeys()
        {
            // arrange
            var obj = new TestClass4 {Prop1 = new List<TestClass1> {new TestClass1 {Prop1 = "Test"}}};
            var newObj = new TestClass4 { Prop1 = new List<TestClass1> { new TestClass1 { Prop1 = "Test123" } } };

            // act
            var patch = JsonPatchFactory.CreatePatch(obj, newObj);

            // assert
            Assert.Collection(patch.Operations.OrderBy(x => x.path), op =>
            {
                Assert.Equal(OperationType.Replace, op.OperationType);
                Assert.Equal("/Prop1", op.path);
            });
        }
    }
}
