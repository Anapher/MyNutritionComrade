using System;
using System.Threading;
using System.Threading.Tasks;
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

        public static async Task WaitForAssert(Action assertAction, TimeSpan? timeout = null)
        {
            timeout ??= TimeSpan.FromSeconds(30);

            try
            {
                using (var cancellationTokenSource = new CancellationTokenSource(timeout.Value))
                {
                    while (true)
                    {
                        try
                        {
                            assertAction();
                            return;
                        }
                        catch (Exception)
                        {
                            // ignored
                        }

                        await Task.Delay(100, cancellationTokenSource.Token);
                    }
                }
            }
            catch (TaskCanceledException)
            {
            }

            assertAction();
        }

        public static async Task WaitForAssertAsync(Func<Task> assertAction, TimeSpan? timeout = null)
        {
            timeout ??= TimeSpan.FromSeconds(30);

            try
            {
                using (var cancellationTokenSource = new CancellationTokenSource(timeout.Value))
                {
                    while (true)
                    {
                        try
                        {
                            await assertAction();
                            return;
                        }
                        catch (Exception)
                        {
                            // ignored
                        }

                        await Task.Delay(100, cancellationTokenSource.Token);
                    }
                }
            }
            catch (TaskCanceledException)
            {
            }

            await assertAction();
        }
    }
}
