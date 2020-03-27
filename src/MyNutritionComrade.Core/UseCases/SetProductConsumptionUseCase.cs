using System.Collections.Immutable;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;
using MyNutritionComrade.Core.Utilities;

namespace MyNutritionComrade.Core.UseCases
{
    public class SetProductConsumptionUseCase : UseCaseStatus<SetProductConsumptionResponse>, ISetProductConsumption
    {
        private readonly IProductRepository _productRepository;
        private readonly IConsumedProductRepository _repository;

        public SetProductConsumptionUseCase(IConsumedProductRepository repository, IProductRepository productRepository)
        {
            _repository = repository;
            _productRepository = productRepository;
        }

        public async Task<SetProductConsumptionResponse?> Handle(SetProductConsumptionRequest message)
        {
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

                    var nutritionInfo = product.NutritionInformation.ChangeMass(message.Value);
                    await _repository.Add(
                        new ConsumedProduct(message.UserId, message.Date, message.ConsumptionTime, message.ProductId, nutritionInfo, product.Tags.ToImmutableHashSet()));
                }

                return new SetProductConsumptionResponse();
            }

            if (message.Value > 0)
            {
                existingConsumption.NutritionInformation = existingConsumption.NutritionInformation.ChangeMass(message.Value);
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
