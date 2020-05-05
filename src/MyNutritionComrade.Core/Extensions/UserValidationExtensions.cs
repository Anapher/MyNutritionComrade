using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;

namespace MyNutritionComrade.Core.Extensions
{
    public class UserValidationResult
    {
        public UserValidationResult(User user)
        {
            IsValid = true;
            User = user;
            Error = null;
        }

        public UserValidationResult(Error error)
        {
            IsValid = false;
            User = null;
            Error = error;
        }

        public bool IsValid { get; }
        public User? User { get; }
        public Error? Error { get; }

        public bool Result([NotNullWhen(false)] out Error? error, [NotNullWhen(true)] out User? user)
        {
            error = Error;
            user = User;

            return IsValid;
        }
    }

    public static class UserValidationExtensions
    {
        public static async Task<UserValidationResult> ValidateUser(this IUserRepository userRepository, string userId)
        {
            var user = await userRepository.FindById(userId);
            if (user == null)
                return new UserValidationResult(new EntityNotFoundError($"The user with id {userId} was not found.", ErrorCode.UserNotFound));

            return new UserValidationResult(user);
        }
    }
}
