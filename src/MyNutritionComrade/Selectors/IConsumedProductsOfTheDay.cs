using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyNutritionComrade.Models.Response;

namespace MyNutritionComrade.Selectors
{
    public interface IConsumedProductsOfTheDay
    {
        Task<List<ConsumedProductDto>> GetConsumedProductsOfTheDay(string userId, DateTime day);
    }
}
