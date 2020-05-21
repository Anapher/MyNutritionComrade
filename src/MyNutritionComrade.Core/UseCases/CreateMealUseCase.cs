using System;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Extensions;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.UseCases
{
    public class CreateMealUseCase : UseCaseStatus<CreateMealResponse>, ICreateMealUseCase
    {
        private readonly IMealRepository _mealRepository;
        private readonly IServiceProvider _serviceProvider;
        private readonly IUserRepository _userRepository;

        public CreateMealUseCase(IUserRepository userRepository, IMealRepository mealRepository, IServiceProvider serviceProvider)
        {
            _userRepository = userRepository;
            _mealRepository = mealRepository;
            _serviceProvider = serviceProvider;
        }

        public async Task<CreateMealResponse?> Handle(CreateMealRequest message)
        {
            if (!(await _userRepository.ValidateUser(message.UserId)).Result(out var error, out var user))
                return ReturnError(error);

            Meal? meal;
            if (message.OverwriteMeal != null)
            {
                meal = await _mealRepository.FindById(message.OverwriteMeal);
                if (meal == null || meal.UserId != user.Id)
                    return ReturnError(new EntityNotFoundError("The meal was not found", ErrorCode.Meal_NotFound));

                meal.Clear();
            }
            else
            {
                meal = new Meal(message.Dto.Name, user.Id);
            }

            foreach (var item in message.Dto.Items)
            {
                var result = await _serviceProvider.CreateFoodPortion(item, user.Id);

                if (!result.Succeeded)
                    return ReturnError(result.Error!);

                meal.Add(result.Response!);
            }

            await _mealRepository.Create(meal);
            return new CreateMealResponse(meal);
        }
    }
}
