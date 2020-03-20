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
    public class AddOrUpdateProductUseCase : UseCaseStatus<AddOrUpdateProductResponse>, IAddOrUpdateProductUseCase
    {
        private readonly IProductRepository _productRepository;
        private readonly IProductContributionsRepository _contributionsRepository;
        private readonly IUserRepository _userRepository;
        private readonly IEnumerable<IProductsChangedEventHandler> _productsChangedEventHandlers;
        private readonly IBsonPatchFactory _bsonPatchFactory;

        public AddOrUpdateProductUseCase(IProductRepository productRepository, IProductContributionsRepository contributionsRepository,
            IUserRepository userRepository, IEnumerable<IProductsChangedEventHandler> productsChangedEventHandlers, IBsonPatchFactory bsonPatchFactory)
        {
            _productRepository = productRepository;
            _contributionsRepository = contributionsRepository;
            _userRepository = userRepository;
            _productsChangedEventHandlers = productsChangedEventHandlers;
            _bsonPatchFactory = bsonPatchFactory;
        }

        public async Task<AddOrUpdateProductResponse?> Handle(AddOrUpdateProductRequest message)
        {
            var user = await _userRepository.FindById(message.UserId);
            if (user == null)
                return ReturnError(new EntityNotFoundError($"The user with id {message.UserId} was not found.", ErrorCode.UserNotFound));

            Product? product = null;
            if (message.ProductId != null)
                product = await _productRepository.FindById(message.ProductId);

            var isCreatingProduct = false;
            if (product == null)
            {
                isCreatingProduct = true;
                product = new Product();
            }

            if (isCreatingProduct)
                await _productRepository.Add(product);

            var patch = _bsonPatchFactory.CreatePatch(product, message.Product);

            var contribution = new ProductContribution(user.Id, product.Id, patch);
            await _contributionsRepository.Add(contribution);

            if (isCreatingProduct || user.IsTrustworthy)
                await _contributionsRepository.Apply(contribution);

            product = await _productRepository.FindById(product.Id);
            if (isCreatingProduct)
            {
                foreach (var handler in _productsChangedEventHandlers)
                    await handler.AddProduct(product!);
            }
            else
            {
                foreach (var handler in _productsChangedEventHandlers)
                    await handler.UpdateProduct(product!);
            }

            return new AddOrUpdateProductResponse(product!);
        }
    }
}
