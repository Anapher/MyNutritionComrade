using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;

namespace MyNutritionComrade.Core.UseCases
{
    public class PatchNutritionGoalsUseCase : UseCaseStatus<PatchNutritionGoalsResponse>, IPatchNutritionGoalsUseCase
    {
        private readonly INutritionGoalRepository _repository;
        private readonly IUserRepository _userRepository;

        public PatchNutritionGoalsUseCase(INutritionGoalRepository repository, IUserRepository userRepository)
        {
            _repository = repository;
            _userRepository = userRepository;
        }

        public async Task<PatchNutritionGoalsResponse?> Handle(PatchNutritionGoalsRequest message)
        {
            var user = await _userRepository.FindById(message.UserId);
            if (user == null)
                return ReturnError(new EntityNotFoundError($"The user with id {message.UserId} was not found.", ErrorCode.UserNotFound));

            var value = await _repository.GetByUser(user.Id) ?? new UserNutritionGoal();

            foreach (var update in message.PartialUserNutritionGoal)
                value[update.Key] = update.Value;

            await _repository.Save(user.Id, value);
            return new PatchNutritionGoalsResponse(value);
        }
    }
}
