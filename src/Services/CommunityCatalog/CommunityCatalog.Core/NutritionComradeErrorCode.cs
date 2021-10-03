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
        UnexpectedError,

        Auth_InvalidPassword,
    }
}
