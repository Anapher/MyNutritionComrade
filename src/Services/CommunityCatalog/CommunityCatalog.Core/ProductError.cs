﻿using System.Collections.Generic;
using CommunityCatalog.Core.Dto;
using CommunityCatalog.Core.Errors;

namespace CommunityCatalog.Core
{
    public class ProductError : ErrorsProvider<NutritionComradeErrorCode>
    {
        public static Error ProductNotFound(string productId)
        {
            return NotFound("The product was not found.", NutritionComradeErrorCode.ProductNotFound,
                new Dictionary<string, string> { { "productId", productId } });
        }

        public static Error NoPatchOperations()
        {
            return NotFound(
                "No patch operations were submitted or the operations that are submitted are already applied.",
                NutritionComradeErrorCode.NoPatchOperations);
        }

        public static Error ProductContributionNotFound(string id)
        {
            return NotFound("The product contribution was not found.",
                NutritionComradeErrorCode.ProductContributionNotFound, new Dictionary<string, string> { { "id", id } });
        }

        public static Error ProductContributionInvalidStatus()
        {
            return NotFound("The product contribution has an invalid status.",
                NutritionComradeErrorCode.ProductContributionInvalidStatus);
        }

        public static Error ProductContributionCreatorCannotVote()
        {
            return NotFound("The product contribution cannot be voted by the same user who created the contribution.",
                NutritionComradeErrorCode.ProductContributionCreatorCannotVote);
        }

        public static Error ProductContributionAlreadyVoted()
        {
            return NotFound("The product contribution was already voted by this user.",
                NutritionComradeErrorCode.ProductContributionAlreadyVoted);
        }

        public static Error UnexpectedError()
        {
            return InternalServerError("An unexpected error occurred.", NutritionComradeErrorCode.UnexpectedError);
        }
    }
}
