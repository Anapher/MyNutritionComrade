using System.Collections.Generic;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ProductDto
    {
        public ProductDto(NutritionInformation nutritionInformation, string? code, IList<LocalizedLabel> label, IList<CustomServingSizeDto> customServingSizes,
            IDictionary<ServingSizeType, double> standardServingSizes, ServingSizeType defaultServingSize)
        {
            NutritionInformation = nutritionInformation;
            Code = code;
            Label = label;
            CustomServingSizes = customServingSizes;
            StandardServingSizes = standardServingSizes;
            DefaultServingSize = defaultServingSize;
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private ProductDto()
        {
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        public NutritionInformation NutritionInformation { get; private set; }
        public string? Code { get; private set; }
        public IList<LocalizedLabel> Label { get; private set; }
        public IList<CustomServingSizeDto> CustomServingSizes { get; private set; }
        public IDictionary<ServingSizeType, double> StandardServingSizes { get; private set; }
        public ServingSizeType DefaultServingSize { get; private set; }
    }
}