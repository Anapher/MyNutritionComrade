using System.Collections.Generic;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class CustomServingSizeDto
    {
        public CustomServingSizeDto(double sizeInGram, IReadOnlyList<ItemLocalizedLabel> label)
        {
            SizeInGram = sizeInGram;
            Label = label;
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private CustomServingSizeDto()
        {
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        public double SizeInGram { get; private set; }
        public IReadOnlyList<ItemLocalizedLabel> Label { get; private set; }
    }
}