namespace MyNutritionComrade.Core.Errors
{
    public enum ErrorCode
    {
        FieldValidation = 0,
        UserNotFound,
        InvalidPassword,
        InvalidToken,


        Identity_DefaultError = 1500,
        Identity_ConcurrencyFailure,
        Identity_PasswordMismatch,
        Identity_InvalidToken,
        Identity_LoginAlreadyAssociated,
        Identity_InvalidUserName,
        Identity_InvalidEmail,
        Identity_DuplicateUserName,
        Identity_DuplicateEmail,
        Identity_InvalidRoleName,
        Identity_DuplicateRoleName,
        Identity_UserAlreadyHasPassword,
        Identity_UserLockoutNotEnabled,
        Identity_UserAlreadyInRole,
        Identity_UserNotInRole,
        Identity_PasswordTooShort,
        Identity_PasswordRequiresNonAlphanumeric,
        Identity_PasswordRequiresDigit,
        Identity_PasswordRequiresLower,
        Identity_PasswordRequiresUpper,

        Product_NotFound = 1600,
        Product_VersionMismatch,
        Product_DuplicateKeyInserted,
        Product_Validation,
        Product_CodeAlreadyExists,
        Product_ExecutionRaceCondition,


        ProductContribution_NotFound = 1700,
        ProductContribution_InvalidStatus,
        ProductContribution_PatchExecutionFailed,
        ProductContribution_UserIsCreator,
        ProductContribution_AlreadyVoted,

    }
}
