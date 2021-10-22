using System;
using System.Collections.Generic;

namespace MyNutritionComrade.Models
{
    /// <param name="Id">Unique id for the product</param>
    /// <param name="Code">The product bar code</param>
    /// <param name="NutritionalInfo">The nutrition information of the product</param>
    /// <param name="Label">
    ///     <para>
    ///         The labels of the product, because equal products may have different labels depending on the location they are
    ///         sold/synonyms.
    ///     </para>
    ///     <para>
    ///         Key: Retrieved from <see cref="CultureInfo.TwoLetterISOLanguageName" />. The culture name in the format
    ///         languagecode2-(country/regioncode2).
    ///         languagecode2 is a lowercase two-letter code derived from ISO 639-1. country/regioncode2 is derived from ISO
    ///         3166
    ///         and usually consists of two uppercase letters, or a BCP-47 language tag.
    ///     </para>
    /// </param>
    /// <param name="Servings">The serving sizes of the product (e. g. 1g, 1 unit, 1 package, ...)</param>
    /// <param name="DefaultServing">The default serving referencing a key in <see cref="Servings" /></param>
    /// <param name="Tags">Tags of the product</param>
    public record Product(string Id, DateTimeOffset ModifiedOn, string? Code,
        IReadOnlyDictionary<string, ProductLabel> Label, NutritionalInfo NutritionalInfo,
        IReadOnlyDictionary<ServingType, double> Servings, ServingType DefaultServing,
        IReadOnlyDictionary<string, bool>? Tags) : ProductProperties(Code, Label, NutritionalInfo, Servings,
        DefaultServing, Tags)
    {
        public static Product FromProperties(ProductProperties properties, string id, DateTimeOffset modifiedOn)
        {
            return new Product(id, modifiedOn, properties.Code, properties.Label, properties.NutritionalInfo,
                properties.Servings, properties.DefaultServing, properties.Tags);
        }
    }
}