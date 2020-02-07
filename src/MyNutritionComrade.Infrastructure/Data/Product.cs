using MongoDB.Bson.Serialization.Attributes;
using MyNutritionComrade.Core.Interfaces.Services;

namespace MyNutritionComrade.Infrastructure.Data
{
    public class Product : IProduct
    {
        /// <summary>
        ///     Barcode of the product (can be EAN-13 or internal codes for some food stores), for products without a barcode, Open
        ///     Food Facts assigns a number starting with the 200 reserved prefix
        /// </summary>
        [BsonElement("code")]
        public string Code { get; set; } = string.Empty;

        /// <summary>
        ///     Url of the product page on Open Food Facts
        /// </summary>
        [BsonElement("url")]
        public string Url { get; set; } = string.Empty;

        /// <summary>
        ///     Name of the product
        /// </summary>
        [BsonElement("product_name ")]
        public string ProductName { get; set; } = string.Empty;

        /// <summary>
        ///     Serving size in g
        /// </summary>
        [BsonElement("serving_size")]
        public double ServingSize { get; set; }

        /// <summary>
        ///     Nutrition grade ('a' to 'e'). see http://fr.openfoodfacts.org/score-nutritionnel-experimental-france
        /// </summary>
        [BsonElement("nutrition_grade_fr")]
        public string? NutritionGrade { get; set; }

        [BsonElement("energy_100g")]
        public int Energy { get; set; }

        [BsonElement("proteins_100g")]
        public double Protein { get; set; }

        [BsonElement("casein_100g")]
        public double Casein { get; set; }

        [BsonElement("carbohydrates_100g")]
        public double Carbohydrates { get; set; }

        [BsonElement("sugars_100g")]
        public double Sugars { get; set; }

        [BsonElement("fat_100g")]
        public double Fat { get; set; }

        [BsonElement("saturated-fat_100g")]
        public double SaturatedFat { get; set; }

        [BsonElement("sodium_100g")]
        public double Sodium { get; set; }

        public double Mass { get; } = 100;
    }
}
