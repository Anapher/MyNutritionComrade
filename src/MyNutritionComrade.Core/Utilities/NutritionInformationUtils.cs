using System.Collections.Generic;
using MyNutritionComrade.Core.Domain;

namespace MyNutritionComrade.Core.Utilities
{
    public static class NutritionInformationUtils
    {
        public static NutritionInformation SumNutrition(this IEnumerable<INutritionInformation> entries)
        {
            var totalMass = 0d;
            var totalEnergy = 0d;
            var totalFat = 0d;
            var totalSaturatedFat = 0d;
            var totalCarbohydrates = 0d;
            var totalSugars = 0d;
            var totalProtein = 0d;
            var totalDietaryFiber = 0d;
            var totalSodium = 0d;

            foreach (var entry in entries)
            {
                totalMass += entry.Volume;
                totalEnergy += entry.Energy;
                totalFat += entry.Fat;
                totalSaturatedFat += entry.SaturatedFat;
                totalCarbohydrates += entry.Carbohydrates;
                totalSugars += entry.Sugars;
                totalProtein += entry.Protein;
                totalDietaryFiber += entry.DietaryFiber;
                totalSodium += entry.Sodium;
            }

            return new NutritionInformation(totalMass, totalEnergy, totalFat, totalSaturatedFat, totalCarbohydrates, totalSugars, totalProtein, totalDietaryFiber, totalSodium);
        }

        public static NutritionInformation ChangeMass(this INutritionInformation nutritionInformation, double newMass)
        {
            var factor = newMass / nutritionInformation.Volume;
            return new NutritionInformation(newMass, nutritionInformation.Energy * factor, nutritionInformation.Fat * factor,
                nutritionInformation.SaturatedFat * factor, nutritionInformation.Carbohydrates * factor, nutritionInformation.Sugars * factor,
                nutritionInformation.Protein * factor, nutritionInformation.DietaryFiber * factor, nutritionInformation.Sodium * factor);
        }
    }
}
