using System.Collections.Generic;
using System.Linq;
using CommunityCatalog.Core.Extensions;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Xunit;

namespace CommunityCatalog.Core.Tests.Extensions
{
    public class JsonUtilsTests
    {
        private readonly JsonSerializer _serializer =
            JsonSerializer.Create(new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
            });

        private record TestClass(string Test, bool Test2);

        [Fact]
        public void FilterRedundantOperations_EmptyOperations_ReturnEmpty()
        {
            // arrange
            var operations = Enumerable.Empty<Operation>();
            var target = new object();

            // act
            var result = JsonUtils.FilterRedundantOperations(operations, target, _serializer);

            // assert
            Assert.Empty(result);
        }

        [Fact]
        public void FilterRedundantOperations_OperationsWithNoEffect_ReturnEmpty()
        {
            // arrange
            var document = new JsonPatchDocument(new List<Operation>(), _serializer.ContractResolver);
            document.Add("/wtf", "hello");

            var target = new TestClass("Test", false);

            // act
            var result = JsonUtils.FilterRedundantOperations(document.Operations, target, _serializer);

            // assert
            Assert.Empty(result);
        }

        [Fact]
        public void FilterRedundantOperations_OperationsWith_ReturnOperation()
        {
            // arrange
            var document = new JsonPatchDocument(new List<Operation>(), _serializer.ContractResolver);
            document.Add("/test", "hello");

            var target = new TestClass("Test", false);

            // act
            var result = JsonUtils.FilterRedundantOperations(document.Operations, target, _serializer);

            // assert
            Assert.Single(result);
        }
    }
}
