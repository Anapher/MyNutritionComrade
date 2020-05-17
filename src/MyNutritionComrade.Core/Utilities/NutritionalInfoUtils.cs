using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using MyNutritionComrade.Core.Domain;
using Newtonsoft.Json;

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

        public static NutritionalInfo ChangeVolume(this INutritionalInfo nutritionalInfo, double newVol)
        {
            var factor = newVol / nutritionalInfo.Volume;
            return new NutritionalInfo(newVol, nutritionalInfo.Energy * factor, nutritionalInfo.Fat * factor,
                nutritionalInfo.SaturatedFat * factor, nutritionalInfo.Carbohydrates * factor, nutritionalInfo.Sugars * factor,
                nutritionalInfo.Protein * factor, nutritionalInfo.DietaryFiber * factor, nutritionalInfo.Sodium * factor);
        }

        public static string Hash(this INutritionalInfo nutritionalInfo)
        {
            var s = JsonConvert.SerializeObject(nutritionalInfo);

            using var md5 = MD5.Create();
            return BitConverter.ToString(md5.ComputeHash(Encoding.UTF8.GetBytes(s))).Replace("-", null).ToLower();
        }
    }
}
