namespace MyNutritionComrade.Core.Domain
{
    public interface INutritionInformation
    {
        /// <summary>
        ///     Mass the data belongs to in gram
        /// </summary>
        double Mass { get; }

        /// <summary>
        ///     Energy in kJ
        /// </summary>
        double Energy { get; }

        /// <summary>
        ///     Share of fat relative to <see cref="Mass"/> in gram
        /// </summary>
        double Fat { get; }

        /// <summary>
        ///     Share of saturated fat relative to <see cref="Mass"/> in gram
        /// </summary>
        double SaturatedFat { get; }

        /// <summary>
        ///     Share of carbohydrates relative to <see cref="Mass"/> in gram
        /// </summary>
        double Carbohydrates { get; }

        /// <summary>
        ///     Share of sugars relative to <see cref="Mass"/> in gram
        /// </summary>
        double Sugars { get; }

        /// <summary>
        ///     Share of protein relative to <see cref="Mass"/> in gram
        /// </summary>
        double Protein { get; }

        /// <summary>
        ///     Share of dietary fiber relative to <see cref="Mass"/> in gram
        /// </summary>
        double DietaryFiber { get; }

        /// <summary>
        ///     Share of sodium relative to <see cref="Mass"/> in gram
        /// </summary>
        double Sodium { get; }
    }
}
