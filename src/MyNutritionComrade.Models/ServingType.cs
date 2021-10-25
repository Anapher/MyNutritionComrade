using System.Collections.Generic;
using System.ComponentModel;
using MyNutritionComrade.Models.Converters;

namespace MyNutritionComrade.Models
{
    [TypeConverter(typeof(ServingTypeConverter))]
    public record ServingType(string Name)
    {
        public static ServingType Gram = new("g");
        public static ServingType Milliliter = new("ml");

        public static ServingType Slice = new("slice");
        public static ServingType Piece = new("piece");
        public static ServingType Bread = new("bread");

        public static ServingType Cup = new("cup");
        public static ServingType TableSpoon = new("ts");
        public static ServingType TeaSpoon = new("te");

        public static ServingType Package = new("package");
        public static ServingType Portion = new("portion");
        public static ServingType Bottle = new("bottle");

        public static ServingType Small = new("small");
        public static ServingType Medium = new("medium");
        public static ServingType Large = new("large");
        public static ServingType ExtraLarge = new("extraLarge");

        public static ISet<ServingType> AvailableTypes = new HashSet<ServingType>
        {
            Gram,
            Milliliter,
            Slice,
            Piece,
            Bread,
            Cup,
            TableSpoon,
            TeaSpoon,
            Package,
            Bottle,
            Portion,
            Large,
            ExtraLarge,
            Small,
            Medium,
        };

        public override string ToString()
        {
            return Name;
        }
    }
}
