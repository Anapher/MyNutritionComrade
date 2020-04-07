using System.Collections.Generic;
using System.Linq;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Infrastructure.Converter;
using MyNutritionComrade.Infrastructure.Utilities;
using Newtonsoft.Json;

namespace MyNutritionComrade.Infrastructure.Patch
{
    public class ManipulationUtils : IObjectManipulationUtils
    {
        public List<PatchOperation> CreatePatch<T>(T original, T modified) where T : class => PatchCreator.CreatePatch(original, modified).ToList();

        public void ExecutePatch(IEnumerable<PatchOperation> operations, object o)
        {
            PatchExecutor.Execute(operations, o);
        }

        public T Clone<T>(T obj)
        {
            var settings = new JsonSerializerSettings {ContractResolver = new InterfaceContractResolver(typeof(T))};
            settings.Converters.AddRequiredConverters();

            var serialized = JsonConvert.SerializeObject(obj, settings);
            return JsonConvert.DeserializeObject<T>(serialized, settings)!;
        }

        public bool Compare<T>(T obj1, T obj2)
        {
            var settings = new JsonSerializerSettings {ContractResolver = new InterfaceContractResolver(typeof(T))};
            settings.Converters.AddRequiredConverters();

            return JsonConvert.SerializeObject(obj1, settings) == JsonConvert.SerializeObject(obj2, settings);
        }
    }
}
