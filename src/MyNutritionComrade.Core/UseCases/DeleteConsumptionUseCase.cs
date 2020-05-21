using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
    public class DeleteConsumptionUseCase : UseCaseStatus<DeleteConsumptionResponse>, IDeleteConsumptionUseCase
    {
        private readonly IUserRepository _userRepository;
        private readonly IConsumedRepository _consumedRepository;

        public DeleteConsumptionUseCase(IUserRepository userRepository, IConsumedRepository consumedRepository)
        {
            _userRepository = userRepository;
            _consumedRepository = consumedRepository;
        }

        public async Task<DeleteConsumptionResponse?> Handle(DeleteConsumptionRequest message)
        {
            if (!(await _userRepository.ValidateUser(message.UserId)).Result(out var error, out var user))
                return ReturnError(error);

            var consumedItems = await _consumedRepository.GetAll(message.UserId, message.Date, message.Time);
            var consumed = consumedItems.FirstOrDefault(x => x.FoodPortionId == message.FoodPortionId && x.FoodPortion.Type == message.FoodPortionType);

            if (consumed == null)
                return ReturnError(new EntityNotFoundError("The consumed object could not be found.", ErrorCode.Consumed_NotFound));

            await _consumedRepository.Delete(consumed);
            return new DeleteConsumptionResponse();
        }
    }
}
