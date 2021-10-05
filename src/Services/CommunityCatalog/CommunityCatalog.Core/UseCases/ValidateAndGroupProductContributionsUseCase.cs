using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CommunityCatalog.Core.Extensions;
using CommunityCatalog.Core.Gateways.Repos;
using CommunityCatalog.Core.Requests;
using CommunityCatalog.Core.Services;
using MediatR;
using MyNutritionComrade.Models;
using MyNutritionComrade.Models.Validation;

namespace CommunityCatalog.Core.UseCases
{
    public class ValidateAndGroupProductContributionsUseCase : IRequestHandler<
        ValidateAndGroupProductContributionsRequest, IReadOnlyList<ProductOperationsGroup>>
    {
        private readonly IProductRepository _productRepository;

        public ValidateAndGroupProductContributionsUseCase(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IReadOnlyList<ProductOperationsGroup>> Handle(
            ValidateAndGroupProductContributionsRequest request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.FindById(request.ProductId);
            if (product == null)
                throw ProductError.ProductNotFound(request.ProductId).ToException();

            var operations = JsonUtils
                .FilterRedundantOperations(request.Operations, product, JsonConfig.DefaultSerializer).ToList();
            if (!operations.Any())
                throw ProductError.NoPatchOperations().ToException();

            var groups = ProductOperationsGroup.GroupOperations(operations).ToList();
            ValidateGroups(groups, product);

            return groups;
        }

        private void ValidateGroups(IEnumerable<ProductOperationsGroup> groups, ProductProperties product)
        {
            var validator = new ProductPropertiesValidator();

            foreach (var productOperationsGroup in groups)
            {
                var patched = JsonUtils.ApplyPatchToProduct(productOperationsGroup.Operations, product);
                var validationResult = validator.Validate(patched);
                if (!validationResult.IsValid)
                {
                    throw validationResult.ToError().ToException();
                }
            }
        }
    }
}
