using System;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class PersonalUserInfo
    {
        public PersonalUserInfo(string id, DateTime? birthday, Gender? gender)
        {
            Id = id;
            Birthday = birthday;
            Gender = gender;
        }

        /// <summary>
        ///     The user id
        /// </summary>
        public string Id { get; private set; }

        /// <summary>
        ///     The birthday of the person. This may be +/- 1 year, so no happy birthday wishing
        /// </summary>
        public DateTime? Birthday { get; private set; }

        /// <summary>
        ///     The gender of the user
        /// </summary>
        public Gender? Gender { get; set; }
    }
}
