using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using FluentValidation;

namespace MyNutritionComrade.Core.Utilities
{
    public static class FluentValidatorExtensions
    {
        public static IRuleBuilderOptions<T, string> IsCulture<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder.Must(x =>
            {
                try
                {
                    var _ = CultureInfo.GetCultureInfo(x);
                    return true;
                }
                catch (Exception)
                {
                    return false;
                }
            }).WithMessage("A localization code is expected");
        }

        public static IRuleBuilderOptions<T, TProperty> OneOf<T, TProperty>(this IRuleBuilder<T, TProperty> ruleBuilder, ISet<TProperty> set)
        {
            return ruleBuilder.Must(set.Contains).WithMessage($"The value must be one of [{string.Join(", ", set)}]");
        }

        public static IRuleBuilderOptions<T, IEnumerable<TProperty>> UniqueItems<T, TProperty>(this IRuleBuilder<T, IEnumerable<TProperty>> ruleBuilder)
        {
            return ruleBuilder.Must(x => x.Distinct().Count() == x.Count()).WithMessage("The list must not contain duplicate items.");
        }
    }
}
