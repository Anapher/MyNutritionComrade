using Microsoft.AspNetCore.JsonPatch;

namespace MyNutritionComrade.Core.Utilities
{
    public interface IJsonPatchUtils
    {
        JsonPatchDocument CreatePatch(object originalObject, object modifiedObject);
    }
}
