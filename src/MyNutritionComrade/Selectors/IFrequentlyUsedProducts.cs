using System.Collections.Generic;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Models.Response;

namespace MyNutritionComrade.Selectors
{
    public interface IFrequentlyUsedProducts
    {
        Task<Dictionary<ConsumptionTime, FrequentlyUsedProductDto[]>> GetFrequentlyUsedProducts(string userId);
    }
}
