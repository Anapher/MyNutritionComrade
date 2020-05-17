using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Dto;
using MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation;

namespace MyNutritionComrade.Core.Services.FoodPortionHandler
{
    public interface IFoodPortionHandler<in T> where T : FoodPortionCreationDto
    {
        ValueTask<SuccessOrError<FoodPortion>> Create(T creationDto, string userId);
    }

    public class SuccessOrError<T> where T : class
    {
        public SuccessOrError(Error error)
        {
            Error = error;
        }

        public SuccessOrError(T response)
        {
            Response = response;
        }

        public Error? Error { get; }
        public bool Succeeded => Error != null;

        public T? Response { get; }
    }
}
