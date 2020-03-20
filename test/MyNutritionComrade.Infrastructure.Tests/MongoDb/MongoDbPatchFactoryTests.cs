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

        [Fact]
        public void Test()
        {
            // arrange
            var obj = new TestClass1 { Prop1 = "Hallo Welt", Prop2 = 34, Prop3 = false };
            var newObj = new TestClass1 { Prop1 = "Hello World", Prop2 = 34, Prop3 = false };

            // act
            var patch = MongoPatchFactory.CreatePatch(obj, newObj);

            var documentSerializer = BsonSerializer.SerializerRegistry.GetSerializer<TestClass1>();
            var asd = patch.Render(documentSerializer, BsonSerializer.SerializerRegistry).ToBsonDocument();
        }
    }
}
