using System.Threading.Tasks;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Extensions;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;

namespace MyNutritionComrade.Core.UseCases
{
    public class DeleteLoggedWeightUseCase : UseCaseStatus<DeleteLoggedWeightResponse>, IDeleteLoggedWeightUseCase
    {
        private readonly ILoggedWeightRepository _repository;
        private readonly IUserRepository _userRepository;

        public DeleteLoggedWeightUseCase(ILoggedWeightRepository repository, IUserRepository userRepository)
        {
            _repository = repository;
            _userRepository = userRepository;
        }

        public async Task<DeleteLoggedWeightResponse?> Handle(DeleteLoggedWeightRequest message)
        {
            if (!(await _userRepository.ValidateUser(message.UserId)).Result(out var error, out var user))
                return ReturnError(error);

            await _repository.Delete(user.Id, message.Timestamp);
            return new DeleteLoggedWeightResponse();
        }
    }
}
