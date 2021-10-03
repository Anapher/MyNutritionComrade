using System;
using System.ComponentModel;
using System.Globalization;

namespace MyNutritionComrade.Models.Converters
{
    public class ServingTypeConverter : TypeConverter
    {
        public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType)
        {
            return sourceType == typeof(string);
        }

        public override object? ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value)
        {
            if (value is string s) return new ServingType(s);
            return base.ConvertFrom(context, culture, value);
        }

        public override object? ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value,
            Type destinationType)
        {
            if (destinationType == typeof(string)) return ((ServingType)value).Name;
            return base.ConvertTo(context, culture, value, destinationType);
        }
    }
}
