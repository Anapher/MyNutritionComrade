using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
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
        private readonly IMapper _mapper;

        public ValidateAndGroupProductContributionsUseCase(IProductRepository productRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<ProductOperationsGroup>> Handle(
            ValidateAndGroupProductContributionsRequest request, CancellationToken cancellationToken)
        {
            var productDocument = await _productRepository.FindById(request.ProductId);
            if (productDocument == null)
                throw ProductError.ProductNotFound(request.ProductId).ToException();

            var productProperties = _mapper.Map<ProductProperties>(productDocument.Product);

            var operations = JsonUtils
                .FilterRedundantOperations(request.Operations, productProperties, JsonConfig.DefaultSerializer)
                .ToList();
            if (!operations.Any())
                throw ProductError.NoPatchOperations().ToException();

            var groups = ProductOperationsGroup.GroupOperations(operations).ToList();
            ValidateGroups(groups, productDocument.Product);

            return groups;
        }

        private static void ValidateGroups(IEnumerable<ProductOperationsGroup> groups, ProductProperties product)
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
