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
        ProductIsReadOnly,

        Auth_InvalidPassword,
    }
}
