using System.Collections.Generic;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Services
{
    public interface IObjectManipulationUtils
    {
        List<PatchOperation> CreatePatch<T>(T original, T modified) where T : class;
        void ExecutePatch(IEnumerable<PatchOperation> operations, object o);

        T Clone<T>(T obj);
        bool Compare<T>(T obj1, T obj2);
    }
}
