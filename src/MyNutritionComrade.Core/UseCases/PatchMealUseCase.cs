using System;
using System.Linq;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Domain.Validation;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Extensions;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;

namespace MyNutritionComrade.Core.UseCases
{
    public class PatchMealUseCase : UseCaseStatus<PatchMealResponse>, IPatchMealUseCase
    {
        private readonly IMealRepository _mealRepository;
        private readonly IProductRepository _productRepository;
        private readonly IUserRepository _userRepository;

        public PatchMealUseCase(IUserRepository userRepository, IMealRepository mealRepository, IProductRepository productRepository)
        {
            _userRepository = userRepository;
            _mealRepository = mealRepository;
            _productRepository = productRepository;
        }

        public async Task<PatchMealResponse?> Handle(PatchMealRequest message)
        {
            if (!(await _userRepository.ValidateUser(message.UserId)).Result(out var error, out var user))
                return ReturnError(error);

            var meal = await _mealRepository.FindById(message.MealId);
            if (meal == null || meal.UserId != user.Id)
                return ReturnError(new EntityNotFoundError($"The meal with id {message.MealId} was not found", ErrorCode.Meal_NotFound));

            throw new NotImplementedException();
            //var dto = MapToDto(meal);
            //message.PatchDocument.ApplyTo(dto);

            //var result = new CreateMealDtoValidator().Validate(dto);
            //if (!result.IsValid)
            //    return ReturnError(new ValidationResultError(result, "The state after applying the patch is invalid.", ErrorCode.Meal_InvalidPatch));

            //foreach (var mealProduct in meal.Items.ToList())
            //{
            //    var productDto = dto.Items.FirstOrDefault(x => x.ProductId == mealProduct.ProductId);

            //    // removed
            //    if (productDto == null)
            //    {
            //        meal.Remove(mealProduct.ProductId);
            //        continue;
            //    }

            //    // changed
            //    if (!productDto.ServingType.Equals(mealProduct.ServingType) || Math.Abs(productDto.Amount - mealProduct.Amount) > 0.5)
            //        meal.Remove(mealProduct.ProductId);
            //}

            //var newMealProducts = dto.Items.Where(x => meal.Items.All(y => x.ProductId != y.ProductId)).ToList();
            //var products = await _productRepository.FindByIds(newMealProducts.Select(x => x.ProductId));

            //foreach (var productDto in newMealProducts)
            //{
            //    if (!products.TryGetValue(productDto.ProductId, out var product))
            //        return ReturnError(new EntityNotFoundError($"The product with id {productDto.ProductId} was not found.", ErrorCode.Product_NotFound));

            //    MealProduct mealProduct;
            //    try
            //    {
            //        mealProduct = MealProduct.Create(product, productDto.Amount, productDto.ServingType);
            //    }
            //    catch (InvalidOperationException e)
            //    {
            //        return ReturnError(new InvalidOperationError(e.Message, ErrorCode.Product_ServingNotFound));
            //    }

            //    meal.Add(mealProduct);
            //}

            //await _mealRepository.Update(meal);
            //return new PatchMealResponse(meal);
        }

        //private static CreateMealDto MapToDto(Meal meal)
        //{
        //    return new CreateMealDto
        //    {
        //        Name = meal.Name,
        //        Items = meal.Items.Select(x => new CreateMealProductDto {Amount = x.Amount, ProductId = x.ProductId, ServingType = x.ServingType})
        //            .OrderBy(x => x.ProductId).ToList()
        //    };
        //}
    }
}
