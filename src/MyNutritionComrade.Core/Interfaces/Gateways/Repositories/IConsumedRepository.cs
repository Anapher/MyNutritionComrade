using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Consumption;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IConsumedRepository
    {
        Task Create(Consumed consumed);
        Task Delete(Consumed consumed);
        Task<List<Consumed>> GetAll(string userId, DateTime dateTime, ConsumptionTime time);
    }
}
