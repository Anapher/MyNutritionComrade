using System.Collections.Generic;
using MyNutritionComrade.Core.Domain;

namespace MyNutritionComrade.Core.Utilities
{
    public static class NutritionalInfoUtils
    {
        public static NutritionalInfo SumNutrition(this IEnumerable<INutritionalInfo> entries)
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

            return new NutritionalInfo(totalMass, totalEnergy, totalFat, totalSaturatedFat, totalCarbohydrates, totalSugars, totalProtein, totalDietaryFiber, totalSodium);
        }

        public static NutritionalInfo ChangeVolume(this INutritionalInfo nutritionalInfo, double newMass)
        {
            var factor = newMass / nutritionalInfo.Volume;
            return new NutritionalInfo(newMass, nutritionalInfo.Energy * factor, nutritionalInfo.Fat * factor,
                nutritionalInfo.SaturatedFat * factor, nutritionalInfo.Carbohydrates * factor, nutritionalInfo.Sugars * factor,
                nutritionalInfo.Protein * factor, nutritionalInfo.DietaryFiber * factor, nutritionalInfo.Sodium * factor);
        }
    }
}
