using System.Collections.Generic;
using CommunityCatalog.Core.Dto;
using CommunityCatalog.Core.Errors;

namespace CommunityCatalog.Core
{
    public class ProductContributionError : ErrorsProvider<NutritionComradeErrorCode>
    {
        public static Error NotFound(string id)
        {
            return NotFound("The product contribution was not found.",
                NutritionComradeErrorCode.ProductContributionNotFound, new Dictionary<string, string> { { "id", id } });
        }

        public static Error InvalidStatus()
        {
            return NotFound("The product contribution has an invalid status.",
                NutritionComradeErrorCode.ProductContributionInvalidStatus);
        }

        public static Error CreatorCannotVote()
        {
            return NotFound("The product contribution cannot be voted by the same user who created the contribution.",
                NutritionComradeErrorCode.ProductContributionCreatorCannotVote);
        }

        public static Error AlreadyVoted()
        {
            return NotFound("The product contribution was already voted by this user.",
                NutritionComradeErrorCode.ProductContributionAlreadyVoted);
        }
    }

    public class ProductError : ErrorsProvider<NutritionComradeErrorCode>
    {
        public static Error ProductNotFound(string productId)
        {
            return NotFound("The product was not found.", NutritionComradeErrorCode.ProductNotFound,
                new Dictionary<string, string> { { "productId", productId } });
        }

        public static Error ProductIsReadOnly(string productId)
        {
            return NotFound("The product is read only.", NutritionComradeErrorCode.ProductIsReadOnly,
                new Dictionary<string, string> { { "productId", productId } });
        }

        public static Error NoPatchOperations()
        {
            return NotFound(
                "No patch operations were submitted or the operations that are submitted are already applied.",
                NutritionComradeErrorCode.NoPatchOperations);
        }


        public static Error ProductWithEqualCodeAlreadyExists(string code, string existingProductId)
        {
            return BadRequest(
                "A product with an equal product code already exists. Please note that the product code must be unique.",
                NutritionComradeErrorCode.ProductCodeAlreadyExists,
                new Dictionary<string, string> { { "code", code }, { "productId", existingProductId } });
        }
    }

    public class CommonError : ErrorsProvider<NutritionComradeErrorCode>
    {
        public static Error UnexpectedError()
        {
            return InternalServerError("An unexpected error occurred.", NutritionComradeErrorCode.UnexpectedError);
        }
    }
}
