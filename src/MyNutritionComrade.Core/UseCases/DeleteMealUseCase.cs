using System.Threading.Tasks;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Extensions;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;

namespace MyNutritionComrade.Core.UseCases
{
    public class DeleteMealUseCase : UseCaseStatus<DeleteMealResponse>, IDeleteMealUseCase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMealRepository _mealRepository;

        public DeleteMealUseCase(IUserRepository userRepository, IMealRepository mealRepository)
        {
            _userRepository = userRepository;
            _mealRepository = mealRepository;
        }

        public async Task<DeleteMealResponse?> Handle(DeleteMealRequest message)
        {
            if (!(await _userRepository.ValidateUser(message.UserId)).Result(out var error, out var user))
                return ReturnError(error);

            var meal = await _mealRepository.FindById(message.MealId);
            if (meal == null || meal.UserId != user.Id)
                return ReturnError(new EntityNotFoundError($"The meal with id {message.MealId} was not found", ErrorCode.Meal_NotFound));

            await _mealRepository.Delete(meal);
            return new DeleteMealResponse();
        }
    }
}
