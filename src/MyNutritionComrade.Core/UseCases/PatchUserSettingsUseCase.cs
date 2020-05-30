using System;
using System.Threading.Tasks;
using FluentValidation;
using Microsoft.Extensions.Logging;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Errors;
using MyNutritionComrade.Core.Extensions;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;

namespace MyNutritionComrade.Core.UseCases
{
    public class PatchUserSettingsUseCase : UseCaseStatus<PatchUserSettingsResponse>, IPatchUserSettingsUseCase
    {
        private readonly IUserSettingsRepository _repository;
        private readonly IUserRepository _userRepository;
        private readonly IValidatorFactory _validatorFactory;
        private readonly ILogger<PatchUserSettingsUseCase> _logger;

        public PatchUserSettingsUseCase(IUserSettingsRepository repository, IUserRepository userRepository, IValidatorFactory validatorFactory, ILogger<PatchUserSettingsUseCase> logger)
        {
            _repository = repository;
            _userRepository = userRepository;
            _validatorFactory = validatorFactory;
            _logger = logger;
        }

        public async Task<PatchUserSettingsResponse?> Handle(PatchUserSettingsRequest message)
        {
            if (!(await _userRepository.ValidateUser(message.UserId)).Result(out var userError, out var user))
                return ReturnError(userError);

            var current = await _repository.GetUserSettings(user.Id) ?? new UserSettings();

            try
            {
                message.PatchDocument.ApplyTo(current);
            }
            catch (Exception e)
            {
                _logger.LogWarning(e, "User patch failed. Patch: {@patch}, user id: {userId}", message.PatchDocument, message.UserId);
                return ReturnError(new FieldValidationError("Patch", "Invalid json patch supplied."));
            }

            var validator = _validatorFactory.GetValidator<UserSettings>();
            var validationResult = await validator.ValidateAsync(current);

            if (!validationResult.IsValid)
                return ReturnError(new ValidationResultError(validationResult));

            await _repository.Save(user.Id, current);
            return new PatchUserSettingsResponse(current);
        }
    }
}
