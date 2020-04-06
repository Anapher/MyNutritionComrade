using Newtonsoft.Json.Converters;

namespace MyNutritionComrade.Config.Converter
{
    public class DateTimeDayOnlyJsonConverter : IsoDateTimeConverter
    {
        public DateTimeDayOnlyJsonConverter()
        {
            DateTimeFormat = "yyyy-MM-dd";
        }
    }
}
