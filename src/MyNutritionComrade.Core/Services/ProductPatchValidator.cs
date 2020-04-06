using System.Collections.Generic;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Domain.Validation;
using MyNutritionComrade.Core.Interfaces.Services;

namespace MyNutritionComrade.Core.Services
{
    public class ProductPatchValidator : IProductPatchValidator
    {
        private readonly ILogger<ProductPatchValidator> _logger;
        private readonly IObjectPatchFactory _patchFactory;

        public ProductPatchValidator(IObjectPatchFactory patchFactory, ILogger<ProductPatchValidator> logger)
        {
            _patchFactory = patchFactory;
            _logger = logger;
        }

        public ValidationResult Validate(IEnumerable<PatchOperation> patch, ProductInfo productInfo)
        {
            var copied = _patchFactory.Copy(productInfo);
            _patchFactory.ExecutePatch(patch, copied);

            var validationResult = new ProductInfoValidator().Validate(copied);
            if (!validationResult.IsValid)
            {
                _logger.LogDebug("Validation for patches {@patchGroup} failed: {@validationResult}", patch, validationResult.Errors);
                return validationResult;
            }

            if (_patchFactory.Compare(productInfo, copied))
                return new ValidationResult(new[] {new ValidationFailure("", "The patch doesn't change the object.")});

            return validationResult;
        }
    }
}
