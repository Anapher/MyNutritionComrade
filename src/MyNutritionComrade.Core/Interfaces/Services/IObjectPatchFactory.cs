namespace MyNutritionComrade.Core.Interfaces.Services
{
    public interface IObjectPatchFactory
    {
        string CreatePatch<T>(T original, T modified) where T : class;
    }
}
