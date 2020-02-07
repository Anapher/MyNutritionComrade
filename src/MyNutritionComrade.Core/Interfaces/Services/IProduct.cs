using MyNutritionComrade.Core.Domain;

namespace MyNutritionComrade.Core.Interfaces.Services
{
    public interface IProduct : INutritionInformation
    {
        public string Code { get;  }
        public string ProductName { get; }
        double ServingSize { get; }
    }
}
