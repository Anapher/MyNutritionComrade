using System.Collections.Generic;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Domain.Entities.Goal;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Extensions;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;

namespace MyNutritionComrade.Core.Services.NutritionHandler
{
    public class CaloriesMifflinStJeorNutritionGoalHandler : INutritionGoalHandler<CaloriesMifflinStJeorNutritionGoal>
    {
        private readonly ILoggedWeightRepository _weightRepository;
        private readonly IUserPersonalInfoRepository _userRepository;

        private static readonly IReadOnlyDictionary<Gender, double> GenderOffsets = new Dictionary<Gender, double> {{Gender.Male, 5}, {Gender.Female, -161},};

        public CaloriesMifflinStJeorNutritionGoalHandler(ILoggedWeightRepository weightRepository, IUserPersonalInfoRepository userRepository)
        {
            _weightRepository = weightRepository;
            _userRepository = userRepository;
        }

        // https://www.fitness-emotion.at/berechnung-grundumsatz/
        public async ValueTask SetGoal(string userId, CalculateCurrentNutritionGoalResponse response, CaloriesMifflinStJeorNutritionGoal goal)
        {
            var bodyweight = await _weightRepository.GetRecentAveragedWeight(userId);
            var personalInfo = await _userRepository.GetPersonalInfo(userId);

            if (bodyweight != null && personalInfo?.Height != null && personalInfo?.Birthday != null && personalInfo?.Gender != null)
            {
                var heightInCm = personalInfo.Height * 100;
                var age = personalInfo.Birthday.Value.GetAge();

                var bmr = (9.99 * bodyweight) + (6.25 * heightInCm) - (4.92 * age) + GenderOffsets[personalInfo.Gender.Value];

                response.CaloriesPerDay = (bmr * goal.PalFactor) + goal.CalorieBalance + goal.CalorieOffset;
            }
        }
    }
}
