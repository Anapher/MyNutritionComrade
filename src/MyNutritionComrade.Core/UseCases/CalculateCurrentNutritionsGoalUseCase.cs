using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Core.Services.NutritionHandler;

namespace MyNutritionComrade.Core.UseCases
{
    public class CalculateCurrentNutritionsGoalUseCase : UseCaseStatus<CalculateCurrentNutritionGoalResponse>, ICalculateCurrentNutritionGoalUseCase
    {
        private readonly INutritionGoalRepository _repository;
        private readonly IUserRepository _userRepository;
        private readonly IServiceProvider _serviceProvider;

        public CalculateCurrentNutritionsGoalUseCase(INutritionGoalRepository repository, IUserRepository userRepository, IServiceProvider serviceProvider)
        {
            _repository = repository;
            _userRepository = userRepository;
            _serviceProvider = serviceProvider;
        }

        public async Task<CalculateCurrentNutritionGoalResponse?> Handle(CalculateCurrentNutritionGoalRequest message)
        {
            var user = await _userRepository.FindById(message.UserId);
            if (user == null)
                return ReturnError(new EntityNotFoundError($"The user with id {message.UserId} was not found.", ErrorCode.UserNotFound));

            var response = new CalculateCurrentNutritionGoalResponse();

            var goals = await _repository.GetByUser(user.Id);
            if (goals != null)
                foreach (var goal in goals.Select(x => x.Value))
                {
                    var serviceType = typeof(INutritionGoalHandler<>).MakeGenericType(goal.GetType());
                    var service = _serviceProvider.GetRequiredService(serviceType);
                    var method = serviceType.GetMethod(nameof(INutritionGoalHandler<string>.SetGoal));

                    var task = (ValueTask) method!.Invoke(service, new[] {user.Id, response, goal})!;
                    await task;
                }

            return response;
        }
    }
}
