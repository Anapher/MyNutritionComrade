//using System.Collections.Generic;
//using System.Globalization;
//using System.Linq;
//using MyNutritionComrade.Core.Domain;
//using MyNutritionComrade.Core.Domain.Entities;

//namespace MyNutritionComrade.Core.Utilities
//{
//    public static class ProductUtils
//    {
//        public static void PatchServings(Product product, IEnumerable<ServingType> servings, IEnumerable<ProductServingDto> sourceServings)
//        {
//            bool CompareItems(ProductServingDto arg1, ServingType arg2)
//            {
//                return arg1.Weight == arg2.Weight;
//            }

//            void AddItem(ProductServingDto obj)
//            {
//                var serving = product.AddProductServing(obj.Weight, new ServingType(obj.ServingType));
//                foreach (var label in obj.Label)
//                {
//                    serving.AddLabel(label.Label, CultureInfo.GetCultureInfo(label.LanguageCode), label.PluralLabel);
//                }
//            }

//            void RemoveItem(ServingType obj)
//            {
//                product.RemoveProductServing(obj.Id);
//            }

//            void UpdateItem(ServingType arg1, ProductServingDto arg2)
//            {
//                ListPatch.PatchStrings(arg2.Label, arg1.ProductServingLabels.ToList(), (x, y) => x.LanguageCode == y.LanguageCode, GetKeys,
//                    label => arg1.RemoveLabel(label.Id), label => arg1.AddLabel(label.Label, CultureInfo.GetCultureInfo(label.LanguageCode), label.PluralLabel),
//                    (label, localizedLabel) =>
//                    {
//                        label.SetName(localizedLabel.Label);
//                        label.PluralLabel = localizedLabel.PluralLabel;
//                    });
//            }

//            ListPatch.PatchList(sourceServings, servings, CompareItems, RemoveItem, AddItem, UpdateItem);
//        }

//        public static void PatchLabels(Product product, IEnumerable<ProductLabel> productLabels, IEnumerable<ProductLabelDto> labels)
//        {
//            ListPatch.PatchStrings(labels, productLabels, (x, y) => x.LanguageCode == y.LanguageCode,
//                (localizedLabel, label) => new[] {(Name: label.Label, localizedLabel.Label)}, label => product.RemoveProductLabel(label.Id),
//                label => product.AddProductLabel(label.Label, CultureInfo.GetCultureInfo(label.LanguageCode)),
//                (label, localizedLabel) => label.SetName(localizedLabel.Label));
//        }

//        private static IEnumerable<(string, string)> GetKeys(ProductServingLabelDto arg1, ProductServingLabel arg2)
//        {
//            yield return (arg1.Label, arg2.Name);

//            if (arg1.PluralLabel != null && arg2.PluralLabel != null)
//                yield return (arg1.PluralLabel!, arg2.PluralLabel!);
//        }
//    }
//}
