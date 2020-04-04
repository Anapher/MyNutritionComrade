using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Core.Interfaces.UseCases;

namespace MyNutritionComrade.Core.UseCases
{
    public class AddProductUseCase : UseCaseStatus<AddProductResponse>, IAddProductUseCase
    {
        private readonly IProductRepository _productRepository;
        private readonly IProductContributionsRepository _contributionsRepository;
        private readonly IUserRepository _userRepository;
        private readonly IEnumerable<IProductsChangedEventHandler> _productsChangedEventHandlers;
        private readonly IObjectPatchFactory _objectPatchFactory;

        public AddProductUseCase(IProductRepository productRepository, IProductContributionsRepository contributionsRepository,
            IUserRepository userRepository, IEnumerable<IProductsChangedEventHandler> productsChangedEventHandlers, IObjectPatchFactory objectPatchFactory)
        {
            _productRepository = productRepository;
            _contributionsRepository = contributionsRepository;
            _userRepository = userRepository;
            _productsChangedEventHandlers = productsChangedEventHandlers;
            _objectPatchFactory = objectPatchFactory;
        }

        public async Task<AddProductResponse?> Handle(AddProductRequest message)
        {
            throw new InvalidOperationException();
            //var user = await _userRepository.FindById(message.UserId);
            //if (user == null)
            //    return ReturnError(new EntityNotFoundError($"The user with id {message.UserId} was not found.", ErrorCode.UserNotFound));

            //var succeeded = false;
            //var product = new Product();

            //try
            //{
            //    if (isCreatingProduct)
            //        await _productRepository.Add(product);

            //    var patch = _objectPatchFactory.CreatePatch(product, message.Product);

            //    var contribution = new ProductContribution(user.Id, product.Id, patch);
            //    await _contributionsRepository.Add(contribution);

            //    if (isCreatingProduct || user.IsTrustworthy)
            //    {
            //        var result = await _contributionsRepository.Apply(contribution);
            //        if (result != null) return ReturnError(result);
            //    }

            //    succeeded = true;
            //}
            //finally
            //{
            //    if (!succeeded && isCreatingProduct)
            //        await _productRepository.Delete(product.Id);
            //}

            //product = await _productRepository.FindById(product.Id);
            //if (isCreatingProduct)
            //{
            //    foreach (var handler in _productsChangedEventHandlers)
            //        await handler.AddProduct(product!);
            //}
            //else
            //{
            //    foreach (var handler in _productsChangedEventHandlers)
            //        await handler.UpdateProduct(product!);
            //}

            //return new AddProductResponse(product!);
        }
    }
}
