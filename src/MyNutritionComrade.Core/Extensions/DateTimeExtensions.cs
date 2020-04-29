using System;

namespace MyNutritionComrade.Core.Extensions
{
    public static class DateTimeExtensions
    {
        public static int GetAge(this DateTime dateTime, DateTime? today = null)
        {
            today ??= DateTime.Today;

            var age = today.Value.Year - dateTime.Year;
            // Go back to the year the person was born in case of a leap year
            if (dateTime.Date > today.Value.AddYears(-age))
                age--;

            return age;
        }
    }
}
