using System.Collections.Generic;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Services
{
    public interface IObjectPatchFactory
    {
        List<PatchOperation> CreatePatch<T>(T original, T modified) where T : class;
        void ExecutePatch(IEnumerable<PatchOperation> operations, object o);
        IEnumerable<PatchOperation[]> GroupPatches(IEnumerable<PatchOperation> operations);
        ProductInfo Copy(ProductInfo productInfo);
        bool Compare(ProductInfo product1, ProductInfo product2);
    }
}
