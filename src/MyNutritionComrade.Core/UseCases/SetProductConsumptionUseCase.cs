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
    public class SetProductConsumptionUseCase : UseCaseStatus<SetProductConsumptionResponse>, ISetProductConsumption
    {
        private readonly IProductRepository _productRepository;
        private readonly IUserRepository _userRepository;
        private readonly IConsumedProductRepository _repository;

        public SetProductConsumptionUseCase(IUserRepository userRepository, IConsumedProductRepository repository, IProductRepository productRepository)
        {
            _userRepository = userRepository;
            _repository = repository;
            _productRepository = productRepository;
        }

        public async Task<SetProductConsumptionResponse?> Handle(SetProductConsumptionRequest message)
        {
            if (!(await _userRepository.ValidateUser(message.UserId)).Result(out var error, out var user))
                return ReturnError(error);

            if (message.Value < 0)
                return ReturnError(new FieldValidationError("Value", "The new consumption value must be greater or equal to 0."));

            var existingConsumption = await _repository.FindExistingConsumedProduct(message.UserId, message.Date, message.ConsumptionTime, message.ProductId);
            if (existingConsumption == null)
            {
                if (message.Value > 0)
                {
                    var product = await _productRepository.FindById(message.ProductId);
                    if (product == null)
                        return ReturnError(new EntityNotFoundError("The product was not found.", ErrorCode.Product_NotFound));

                    await _repository.Add(ConsumedProduct.FromProduct(product, message.Value, user.Id, message.Date, message.ConsumptionTime));
                }

                return new SetProductConsumptionResponse();
            }

            if (message.Value > 0)
            {
                existingConsumption.NutritionalInfo = existingConsumption.NutritionalInfo.ChangeVolume(message.Value);
                await _repository.Update(existingConsumption);
            }
            else
            {
                // the value is 0. We remove the product
                await _repository.Delete(existingConsumption);
            }

            return new SetProductConsumptionResponse();
        }
    }
}
