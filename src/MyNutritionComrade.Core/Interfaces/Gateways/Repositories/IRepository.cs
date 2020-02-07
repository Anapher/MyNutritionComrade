
using System.Collections.Generic;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Shared;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IRepository<T> where T : notnull, BaseEntity
    {
        ValueTask<T?> GetById(int id);
        Task<IList<T>> GetAll();
        Task<T?> FirstOrDefaultBySpecs(params ISpecification<T>[] specs);
        Task<IList<T>> GetAllBySpecs(params ISpecification<T>[] specs);
        Task<IList<T>> GetLimitedBySpecs(int limit, params ISpecification<T>[] specs);

        Task<T> Add(T entity);
        Task Update(T entity);
        Task Delete(T entity);
    }
}