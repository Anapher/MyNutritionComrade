using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Extensions;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;

namespace MyNutritionComrade.Core.UseCases
{
    public class LogWeightUseCase : UseCaseStatus<LogWeightResponse>, ILogWeightUseCase
    {
        private readonly ILoggedWeightRepository _repository;
        private readonly IUserRepository _userRepository;

        public LogWeightUseCase(IUserRepository userRepository, ILoggedWeightRepository repository)
        {
            _userRepository = userRepository;
            _repository = repository;
        }

        public async Task<LogWeightResponse?> Handle(LogWeightRequest message)
        {
            if (!(await _userRepository.ValidateUser(message.UserId)).Result(out var userError, out var user)) return ReturnError(userError);

            if (message.Weight <= 0)
                return ReturnError(new FieldValidationError("weight", "The weight must be greater than zero."));

            var entity = new LoggedWeight(user.Id, message.Weight, message.Timestamp);
            await _repository.Add(entity);

            return new LogWeightResponse(entity);
        }
    }
}
