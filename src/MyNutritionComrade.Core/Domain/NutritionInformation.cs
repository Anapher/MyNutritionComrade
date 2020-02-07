using System;

namespace MyNutritionComrade.Core.Domain
{
    public class NutritionInformation : INutritionInformation
    {
        public NutritionInformation(double mass, double energy, double fat, double saturatedFat, double carbohydrates, double sugars, double protein,
            double dietaryFiber, double sodium)
        {
            Mass = mass;
            Energy = energy;
            Fat = fat;
            SaturatedFat = saturatedFat;
            Carbohydrates = carbohydrates;
            Sugars = sugars;
            Protein = protein;
            DietaryFiber = dietaryFiber;
            Sodium = sodium;
        }

        private NutritionInformation()
        {
        }

        public static NutritionInformation Empty { get; } = new NutritionInformation();

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        public double Mass { get; private set; }

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        public double Energy { get; private set; }

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        public double Fat { get; private set; }

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        public double SaturatedFat { get; private set; }

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        public double Carbohydrates { get; private set; }

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        public double Sugars { get; private set; }

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        public double Protein { get; private set; }

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        public double DietaryFiber { get; private set; }

        /// <summary>
        ///     <inheritdoc />
        /// </summary>
        public double Sodium { get; private set; }

        protected bool Equals(NutritionInformation other) =>
            Mass.Equals(other.Mass) && Energy.Equals(other.Energy) && Fat.Equals(other.Fat) && SaturatedFat.Equals(other.SaturatedFat) &&
            Carbohydrates.Equals(other.Carbohydrates) && Sugars.Equals(other.Sugars) && Protein.Equals(other.Protein) &&
            DietaryFiber.Equals(other.DietaryFiber) && Sodium.Equals(other.Sodium);

        public override bool Equals(object? obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != GetType()) return false;
            return Equals((NutritionInformation) obj);
        }

        public override int GetHashCode()
        {
            var hashCode = new HashCode();
            hashCode.Add(Mass);
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
