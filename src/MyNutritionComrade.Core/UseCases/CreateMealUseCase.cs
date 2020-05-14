using System;
using System.Linq;
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
    public class CreateMealUseCase : UseCaseStatus<CreateMealResponse>, ICreateMealUseCase
    {
        private readonly IMealRepository _mealRepository;
        private readonly IProductRepository _productRepository;
        private readonly IUserRepository _userRepository;

        public CreateMealUseCase(IUserRepository userRepository, IProductRepository productRepository, IMealRepository mealRepository)
        {
            _userRepository = userRepository;
            _productRepository = productRepository;
            _mealRepository = mealRepository;
        }

        public async Task<CreateMealResponse?> Handle(CreateMealRequest message)
        {
            if (!(await _userRepository.ValidateUser(message.UserId)).Result(out var error, out var user))
                return ReturnError(error);

            var dto = message.Dto;
            var meal = new Meal(dto.Name, user.Id);

            var products = await _productRepository.FindByIds(meal.Products.Select(x => x.ProductId));

            foreach (var mealProductDto in dto.Products)
            {
                if (!products.TryGetValue(mealProductDto.ProductId, out var product))
                    return ReturnError(new EntityNotFoundError($"The product with id {mealProductDto.ProductId} was not found.", ErrorCode.Product_NotFound));

                MealProduct mealProduct;
                try
                {
                    mealProduct = MealProduct.Create(product, mealProductDto.Amount, mealProductDto.ServingType);
                }
                catch (InvalidOperationException e)
                {
                    return ReturnError(new InvalidOperationError(e.Message, ErrorCode.Product_ServingNotFound));
                }

                meal.AddProduct(mealProduct);
            }

            await _mealRepository.Create(meal);
            return new CreateMealResponse(meal);
        }
    }
}
