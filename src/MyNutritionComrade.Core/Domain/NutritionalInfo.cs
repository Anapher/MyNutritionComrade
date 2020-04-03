using System;
using Newtonsoft.Json;

namespace MyNutritionComrade.Core.Domain
{
    /// <summary>
    ///     Macro nutrition information
    /// </summary>
    public class NutritionalInfo : INutritionalInfo
    {
        public NutritionalInfo(double volume, double energy, double fat, double saturatedFat, double carbohydrates, double sugars, double protein,
            double dietaryFiber, double sodium)
        {
            Volume = volume;
            Energy = energy;
            Fat = fat;
            SaturatedFat = saturatedFat;
            Carbohydrates = carbohydrates;
            Sugars = sugars;
            Protein = protein;
            DietaryFiber = dietaryFiber;
            Sodium = sodium;
        }

        private NutritionalInfo()
        {
        }

        public static NutritionalInfo Empty { get; } = new NutritionalInfo();

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        [JsonProperty]
        public double Volume { get; private set; }

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        [JsonProperty]
        public double Energy { get; private set; }

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        [JsonProperty]
        public double Fat { get; private set; }

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        [JsonProperty]
        public double SaturatedFat { get; private set; }

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        [JsonProperty]
        public double Carbohydrates { get; private set; }

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        [JsonProperty]
        public double Sugars { get; private set; }

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        [JsonProperty]
        public double Protein { get; private set; }

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        [JsonProperty]
        public double DietaryFiber { get; private set; }

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        [JsonProperty]
        public double Sodium { get; private set; }

        protected bool Equals(NutritionalInfo other) =>
            Volume.Equals(other.Volume) && Energy.Equals(other.Energy) && Fat.Equals(other.Fat) && SaturatedFat.Equals(other.SaturatedFat) &&
            Carbohydrates.Equals(other.Carbohydrates) && Sugars.Equals(other.Sugars) && Protein.Equals(other.Protein) &&
            DietaryFiber.Equals(other.DietaryFiber) && Sodium.Equals(other.Sodium);

        public override bool Equals(object? obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != GetType()) return false;
            return Equals((NutritionalInfo) obj);
        }

        public override int GetHashCode()
        {
            var hashCode = new HashCode();
            hashCode.Add(Volume);
            hashCode.Add(Energy);
            hashCode.Add(Fat);
            hashCode.Add(SaturatedFat);
            hashCode.Add(Carbohydrates);
            hashCode.Add(Sugars);
            hashCode.Add(Protein);
            hashCode.Add(DietaryFiber);
            hashCode.Add(Sodium);
            return hashCode.ToHashCode();
        }
    }
}
