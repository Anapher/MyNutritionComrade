using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MyNutritionComrade.Infrastructure.MongoDb;
using Xunit;

namespace MyNutritionComrade.Infrastructure.Tests.MongoDb
{
    public class MongoDbPatchFactoryTests
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

        public class ListObj
        {
            public ListObj(string key, string value)
            {
                Key = key;
                Value = value;
            }

            public ListObj()
            {
            }

            public string Key { get; set; }
            public string Value { get; set; }

            protected bool Equals(ListObj other) => Key == other.Key && Value == other.Value;

            public override bool Equals(object obj)
            {
                if (ReferenceEquals(null, obj)) return false;
                if (ReferenceEquals(this, obj)) return true;
                if (obj.GetType() != this.GetType()) return false;
                return Equals((ListObj) obj);
            }

            public override int GetHashCode() => HashCode.Combine(Key, Value);
        }

        public class TestClass3
        {
            public List<ListObj> Prop1 { get; set; }
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
            var obj = new TestClass1 { Prop1 = "Hallo Welt", Prop2 = 34, Prop3 = false };
            var newObj = new TestClass1 { Prop1 = "Hello World", Prop2 = 34, Prop3 = false };

            // act
            var patch = MongoPatchFactory.CreatePatch(obj, newObj);

            // assert
            AssertPatch(patch, "{ \"$set\" : { \"Prop1\" : \"Hello World\" } }");
        }

        [Fact]
        public void TestCreatePatchFlatObjectMultipleValues()
        {
            // arrange
            var obj = new TestClass1 { Prop1 = "Hallo Welt", Prop2 = 34, Prop3 = false };
            var newObj = new TestClass1 { Prop1 = "Hallo Welt", Prop2 = 43, Prop3 = true };

            // act
            var patch = MongoPatchFactory.CreatePatch(obj, newObj);

            // assert
            AssertPatch(patch, "{ \"$set\" : { \"Prop2\" : 43, \"Prop3\" : true } }");
        }

        [Fact]
        public void TestCreatePatchDeepObjectMultipleValues()
        {
            // arrange
            var obj = new TestClass2 { Prop1 = new TestClass1 { Prop1 = "Hallo Welt", Prop2 = 34, Prop3 = false }, Prop2 = "asd" };
            var newObj = new TestClass2 { Prop1 = new TestClass1 { Prop1 = "Hello Welt", Prop2 = 34, Prop3 = false }, Prop2 = "das" };

            // act
            var patch = MongoPatchFactory.CreatePatch(obj, newObj);

            // assert
            AssertPatch(patch, "{ \"$set\" : { \"Prop1.Prop1\" : \"Hello Welt\", \"Prop2\" : \"das\" } }");
        }

        [Fact]
        public void TestCreatePatchFlatListAddItem()
        {
            // arrange
            var obj = new TestClass3 { Prop1 = new List<ListObj>() };
            var newObj = new TestClass3 {Prop1 = new List<ListObj> {new ListObj("1", "Hello")}};

            // act
            var patch = MongoPatchFactory.CreatePatch(obj, newObj);

            // assert
            AssertPatch(patch, "{ \"$addToSet\" : { \"Prop1\" : { \"Key\" : \"1\", \"Value\" : \"Hello\" } } }");
        }

        [Fact]
        public void TestCreatePatchFlatListAddItems()
        {
            // arrange
            var obj = new TestClass3 { Prop1 = new List<ListObj>() };
            var newObj = new TestClass3 { Prop1 = new List<ListObj> { new ListObj("1", "Hello"), new ListObj("2", "Wtf") } };

            // act
            var patch = MongoPatchFactory.CreatePatch(obj, newObj);

            // assert
            AssertPatch(patch, "{ \"$addToSet\" : { \"Prop1\" : { \"$each\" : [{ \"Key\" : \"1\", \"Value\" : \"Hello\" }, { \"Key\" : \"2\", \"Value\" : \"Wtf\" }] } } }");
        }

        [Fact]
        public void TestCreatePatchFlatListRemoveItem()
        {
            // arrange
            var obj = new TestClass3
            {
                Prop1 = new List<ListObj>
                {
                    new ListObj("1", "Corona"), new ListObj("2", "Pls dont kill me")
                }
            };
            var newObj = new TestClass3 {Prop1 = new List<ListObj> {new ListObj("1", "Corona")}};

            // act
            var patch = MongoPatchFactory.CreatePatch(obj, newObj);

            // assert
            AssertPatch(patch, "{ \"$pull\" : { \"Prop1\" : { \"Key\" : \"2\", \"Value\" : \"Pls dont kill me\" } } }");
        }

        [Fact]
        public void TestCreatePatchFlatListRemoveItems()
        {
            // arrange
            var obj = new TestClass3
            {
                Prop1 = new List<ListObj>
                {
                    new ListObj("1", "Corona"), new ListObj("2", "Pls dont kill me"),  new ListObj("3", "Merkel for president")
                }
            };
            var newObj = new TestClass3 { Prop1 = new List<ListObj> { new ListObj("1", "Corona") } };

            // act
            var patch = MongoPatchFactory.CreatePatch(obj, newObj);

            // assert
            AssertPatch(patch, "{ \"$pullAll\" : { \"Prop1\" : [{ \"Key\" : \"2\", \"Value\" : \"Pls dont kill me\" }, { \"Key\" : \"3\", \"Value\" : \"Merkel for president\" }] } }") ;
        }

        [Fact]
        public void TestCreatePatchFlatListPatchItem()
        {
            // arrange
            var obj = new TestClass3
            {
                Prop1 = new List<ListObj> { new ListObj { Key = "1", Value = "Corona" }, new ListObj { Key = "2", Value = "Pls dont kill me" } }
            };
            var newObj = new TestClass3 { Prop1 = new List<ListObj> { new ListObj { Key = "1", Value = "Corona" }, new ListObj { Key = "2", Value = "Plx dont kill me" } } };

            // act
            var patch = MongoPatchFactory.CreatePatch(obj, newObj);

            // assert
            AssertPatch(patch, "{ \"$pull\" : { \"Prop1\" : { \"Key\" : \"2\", \"Value\" : \"Pls dont kill me\" } }, \"$addToSet\" : { \"Prop1\" : { \"Key\" : \"2\", \"Value\" : \"Plx dont kill me\" } } }");
        }

        private void AssertPatch<T>(UpdateDefinition<T> def, string expected)
        {
            var documentSerializer = BsonSerializer.SerializerRegistry.GetSerializer<T>();
            var s = def.Render(documentSerializer, BsonSerializer.SerializerRegistry).ToBsonDocument().ToString();

            Assert.Equal(expected, s);
        }
    }
}
