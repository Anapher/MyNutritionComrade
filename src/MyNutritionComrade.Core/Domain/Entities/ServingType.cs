using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;

namespace MyNutritionComrade.Core.Domain.Entities
{
    [TypeConverter(typeof(ServingTypeConverter))]
    public class ServingType
    {
        protected bool Equals(ServingType other) => Name == other.Name;

        public override bool Equals(object? obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((ServingType) obj);
        }

        public override int GetHashCode() => Name.GetHashCode();

        public ServingType(string name)
        {
            Name = name;
        }

        public override string ToString() => Name;

        public string Name { get; }

        public static ServingType Gram = new ServingType("g");
        public static ServingType Milliliter = new ServingType("ml");

        public static ServingType Slice = new ServingType("slice");
        public static ServingType Piece = new ServingType("piece");
        public static ServingType Bread = new ServingType("bread");

        public static ServingType Cup = new ServingType("cup");
        public static ServingType TableSpoon = new ServingType("el");
        public static ServingType TeaSpoon = new ServingType("tl");

        public static ServingType Package = new ServingType("package");
        public static ServingType Bottle = new ServingType("bottle");

        public static ServingType Small = new ServingType("small");
        public static ServingType Medium = new ServingType("medium");
        public static ServingType Large = new ServingType("large");
        public static ServingType ExtraLarge = new ServingType("extraLarge");

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
            Large,
            ExtraLarge,
            Small,
            Medium
        };
    }

    public class ServingTypeConverter : TypeConverter
    {
        public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType)
        {
            return sourceType == typeof(string);
        }

        public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value)
        {
            if (value is string s) return new ServingType(s);
            return base.ConvertFrom(context, culture, value);
        }

        public override object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value, Type destinationType)
        {
            if (destinationType == typeof(string)) return ((ServingType) value).Name;
            return base.ConvertTo(context, culture, value, destinationType);
        }
    }
}