using System;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class UserPersonalInfo
    {
        /// <summary>
        ///     The birthday of the person. This may be +/- 1 year, so no happy birthday wishing
        /// </summary>
        public DateTime? Birthday { get; set; }

        /// <summary>
        ///     The gender of the user
        /// </summary>
        public Gender? Gender { get; set; }

        /// <summary>
        ///     The body height in meter
        /// </summary>
        public double? Height { get; set; }
    }
}
