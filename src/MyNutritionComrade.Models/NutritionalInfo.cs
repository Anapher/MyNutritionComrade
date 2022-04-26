namespace MyNutritionComrade.Models
{
    /// <summary>
    ///     Macro nutrition information
    /// </summary>
    public record NutritionalInfo(double Volume, double Energy, double Fat, double SaturatedFat, double Carbohydrates,
        double Sugars, double Protein,
        double DietaryFiber, double Sodium)
    {
        public static NutritionalInfo Empty => new(0, 0, 0, 0, 0, 0, 0, 0, 0);

        public NutritionalInfo ChangeVolume(double newVolume)
        {
            var factor = newVolume / Volume;
            return new NutritionalInfo(Volume * factor, Energy * factor, Fat * factor, SaturatedFat * factor,
                Carbohydrates * factor, Sugars * factor, Protein * factor, DietaryFiber * factor, Sodium * factor);
        }
    }
}