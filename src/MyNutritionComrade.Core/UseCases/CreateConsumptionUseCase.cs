using System;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Extensions;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.UseCases
{
    public class CreateConsumptionUseCase : UseCaseStatus<CreateConsumptionResponse>, ICreateConsumptionUseCase
    {
        private readonly IUserRepository _userRepository;
        private readonly IConsumedRepository _repository;
        private readonly IServiceProvider _serviceProvider;

        public CreateConsumptionUseCase(IUserRepository userRepository, IConsumedRepository repository, IServiceProvider serviceProvider)
        {
            _userRepository = userRepository;
            _repository = repository;
            _serviceProvider = serviceProvider;
        }

        public async Task<CreateConsumptionResponse?> Handle(CreateConsumptionRequest message)
        {
            if (!(await _userRepository.ValidateUser(message.UserId)).Result(out var error, out var user))
                return ReturnError(error);

            var foodPortion = await _serviceProvider.CreateFoodPortion(message.Dto, user.Id);
            if (!foodPortion.Succeeded)
                return ReturnError(foodPortion.Error!);

            var consumed = new Consumed(user.Id, message.Date, message.ConsumptionTime, foodPortion.Response!);
            await _repository.Create(consumed);

            return new CreateConsumptionResponse(consumed);
        }
    }
}
