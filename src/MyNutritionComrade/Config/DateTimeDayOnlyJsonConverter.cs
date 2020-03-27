using Newtonsoft.Json.Converters;

namespace MyNutritionComrade.Config
{
    public class DateTimeDayOnlyJsonConverter : IsoDateTimeConverter
    {
        public DateTimeDayOnlyJsonConverter()
        {
            DateTimeFormat = "yyyy-MM-dd";
        }
    }
}
