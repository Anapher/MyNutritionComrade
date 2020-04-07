using System.Collections.Generic;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Services
{
    public interface IProductPatchGrouper
    {
        IEnumerable<PatchOperation[]> GroupPatch(IEnumerable<PatchOperation> operations);
    }
}
