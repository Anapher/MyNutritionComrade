using System.Collections.Generic;

namespace MyNutritionComrade.Models
{
    public record ProductProperties(string? Code, IReadOnlyDictionary<string, ProductLabel> Label,
        NutritionalInfo NutritionalInfo, IReadOnlyDictionary<ServingType, double> Servings, ServingType DefaultServing,
        IReadOnlyDictionary<string, bool>? Tags)
    {
        /// <summary>
        ///     This tag defines this product as a liquid substance
        /// </summary>
        public const string TAG_LIQUID = "liquid";

        /// <summary>
        ///     Get all allowed tags for a product
        /// </summary>
        public static readonly ISet<string> AllowedTags = new HashSet<string>(new List<string> { TAG_LIQUID });
    }
}
