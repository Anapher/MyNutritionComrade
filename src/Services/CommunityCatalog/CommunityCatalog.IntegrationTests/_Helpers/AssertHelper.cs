using CommunityCatalog.Core;
using CommunityCatalog.Core.Dto;
using Newtonsoft.Json.Linq;
using Xunit;

namespace CommunityCatalog.IntegrationTests._Helpers
{
    public static class AssertHelper
    {
        public static void AssertObjectsEqualJson<T>(T o1, T o2) where T : class
        {
            // if the object types are different (superclass), we need to remove additional properties before comparing

            var t1 = JToken.FromObject(o1);
            var t2 = JToken.FromObject(o2);

            o1 = t1.ToObject<T>()!;
            o2 = t2.ToObject<T>()!;

            t1 = JToken.FromObject(o1);
            t2 = JToken.FromObject(o2);

            Assert.Equal(t1.ToString(), t2.ToString());
        }

        public static void AssertErrorType(Error error, NutritionComradeErrorCode code)
        {
            Assert.Equal(code.ToString(), error.Code);
        }
    }
}
