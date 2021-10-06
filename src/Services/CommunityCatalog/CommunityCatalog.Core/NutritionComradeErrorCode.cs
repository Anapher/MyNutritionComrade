namespace CommunityCatalog.Core
{
    public enum NutritionComradeErrorCode
    {
        ProductNotFound,
        NoPatchOperations,
        ProductContributionNotFound,
        ProductContributionInvalidStatus,
        ProductContributionCreatorCannotVote,
        ProductContributionAlreadyVoted,
        ProductCodeAlreadyExists,
        UnexpectedError,

        Auth_InvalidPassword,
    }
}
