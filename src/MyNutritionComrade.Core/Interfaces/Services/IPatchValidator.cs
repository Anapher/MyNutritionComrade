using System.Collections.Generic;
using FluentValidation.Results;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Services
{
    public interface IProductPatchValidator
    {
        ValidationResult Validate(IEnumerable<PatchOperation> patch, ProductInfo productInfo);
    }
}
