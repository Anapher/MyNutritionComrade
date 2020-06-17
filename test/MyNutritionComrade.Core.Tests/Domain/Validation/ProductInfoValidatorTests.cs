using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Validation;
using Newtonsoft.Json;
using Xunit;

namespace MyNutritionComrade.Core.Tests.Domain.Validation
{
    public class ProductInfoValidatorTests
    {
        [Fact]
        public void TestEmptyProduct()
        {
            TestProduct("{}", false);
        }

        [Fact]
        public void TestValidProduct()
        {
            TestProduct(@"
{
  ""Code"": null,
  ""NutritionalInfo"": {
    ""Volume"": 100.0,
    ""Energy"": 244.0,
    ""Fat"": 0.0,
    ""SaturatedFat"": 0.0,
    ""Carbohydrates"": 20.0,
    ""Sugars"": 0.0,
    ""Protein"": 12.0,
    ""DietaryFiber"": 0.0,
    ""Sodium"": 0.5
  },
  ""Label"": {
      ""de"": {
          ""Value"": ""Haferflocken"",
          ""Tags"": [""Nices Zeug""]
      }
  },
  ""Servings"": {
    ""g"": 1.0
  },
  ""DefaultServing"": ""g"",
  ""Tags"": []
}", true);
        }

        [Fact]
        public void TestProductCodeEmptyString()
        {
            TestProduct(@"
{
  ""Code"": """",
  ""NutritionalInfo"": {
    ""Volume"": 100.0,
    ""Energy"": 244.0,
    ""Fat"": 0.0,
    ""SaturatedFat"": 0.0,
    ""Carbohydrates"": 20.0,
    ""Sugars"": 0.0,
    ""Protein"": 12.0,
    ""DietaryFiber"": 0.0,
    ""Sodium"": 0.5
  },
  ""Label"": {
      ""de"": {
          ""Value"": ""Haferflocken"",
          ""Tags"": [""Nices Zeug""]
      }
  },
  ""Servings"": {
    ""g"": 1.0
  },
  ""DefaultServing"": ""g"",
  ""Tags"": []
}", false);
        }

        [Fact]
        public void TestProductWithDifferentVolume()
        {
            TestProduct(@"
{
  ""Code"": null,
  ""NutritionalInfo"": {
    ""Volume"": 99.0,
    ""Energy"": 244.0,
    ""Fat"": 0.0,
    ""SaturatedFat"": 0.0,
    ""Carbohydrates"": 20.0,
    ""Sugars"": 0.0,
    ""Protein"": 12.0,
    ""DietaryFiber"": 0.0,
    ""Sodium"": 0.5
  },
  ""Label"": {
      ""de"": {
          ""Value"": ""Haferflocken"",
          ""Tags"": [""Nices Zeug""]
      }
  },
  ""Servings"": {
    ""g"": 1.0
  },
  ""DefaultServing"": ""g"",
  ""Tags"": []
}", false);
        }

        [Fact]
        public void TestProductWithNoEnergySpecified()
        {
            TestProduct(@"
{
  ""Code"": null,
  ""NutritionalInfo"": {
    ""Volume"": 100.0,
    ""Fat"": 0.0,
    ""SaturatedFat"": 0.0,
    ""Carbohydrates"": 32.0,
    ""Sugars"": 0.0,
    ""Protein"": 12.0,
    ""DietaryFiber"": 0.0,
    ""Sodium"": 0.5
  },
  ""Label"": {
      ""de"": {
          ""Value"": ""Haferflocken"",
          ""Tags"": [""Nices Zeug""]
      }
  },
  ""Servings"": {
    ""g"": 1.0
  },
  ""DefaultServing"": ""g"",
  ""Tags"": []
}", false);
        }

        [Fact]
        public void TestProductWithEnergyZero()
        {
            TestProduct(@"
{
  ""Code"": null,
  ""NutritionalInfo"": {
    ""Volume"": 100.0,
    ""Energy"": 0,
    ""Fat"": 0.0,
    ""SaturatedFat"": 0.0,
    ""Carbohydrates"": 20.0,
    ""Sugars"": 0.0,
    ""Protein"": 12.0,
    ""DietaryFiber"": 0.0,
    ""Sodium"": 0.5
  },
  ""Label"": {
      ""de"": {
          ""Value"": ""Haferflocken"",
          ""Tags"": [""Nices Zeug""]
      }
  },
  ""Servings"": {
    ""g"": 1.0
  },
  ""DefaultServing"": ""g"",
  ""Tags"": []
}", false);
        }

        [Fact]
        public void TestProductWithNoLabels()
        {
            TestProduct(@"
{
  ""Code"": null,
  ""NutritionalInfo"": {
    ""Volume"": 100.0,
    ""Energy"": 244,
    ""Fat"": 0.0,
    ""SaturatedFat"": 0.0,
    ""Carbohydrates"": 20.0,
    ""Sugars"": 0.0,
    ""Protein"": 12.0,
    ""DietaryFiber"": 0.0,
    ""Sodium"": 0.5
  },
  ""Label"": {},
  ""Servings"": {
    ""g"": 1.0
  },
  ""DefaultServing"": ""g"",
  ""Tags"": []
}", false);
        }

        [Fact]
        public void TestProductWithDuplicateTags()
        {
            TestProduct(@"
{
  ""Code"": null,
  ""NutritionalInfo"": {
    ""Volume"": 100.0,
    ""Energy"": 244.0,
    ""Fat"": 0.0,
    ""SaturatedFat"": 0.0,
    ""Carbohydrates"": 20.0,
    ""Sugars"": 0.0,
    ""Protein"": 12.0,
    ""DietaryFiber"": 0.0,
    ""Sodium"": 0.5
  },
  ""Label"": {
      ""de"": {
          ""Value"": ""Haferflocken"",
          ""Tags"": [""Hafis"", ""Hafis""]
      }
  },
  ""Servings"": {
    ""g"": 1.0
  },
  ""DefaultServing"": ""g"",
  ""Tags"": []
}", false);
        }

        [Fact]
        public void TestProductWithLabelEmptyValue()
        {
            TestProduct(@"
{
  ""Code"": null,
  ""NutritionalInfo"": {
    ""Volume"": 100.0,
    ""Energy"": 244.0,
    ""Fat"": 0.0,
    ""SaturatedFat"": 0.0,
    ""Carbohydrates"": 20.0,
    ""Sugars"": 0.0,
    ""Protein"": 12.0,
    ""DietaryFiber"": 0.0,
    ""Sodium"": 0.5
  },
  ""Label"": {
      ""de"": {
          ""Value"": """",
          ""Tags"": [""Nices Zeug""]
      }
  },
  ""Servings"": {
    ""g"": 1.0
  },
  ""DefaultServing"": ""g"",
  ""Tags"": []
}", false);
        }

        [Fact]
        public void TestProductWithInvalidLanguageCode()
        {
            TestProduct(@"
{
  ""Code"": null,
  ""NutritionalInfo"": {
    ""Volume"": 100.0,
    ""Energy"": 244.0,
    ""Fat"": 0.0,
    ""SaturatedFat"": 0.0,
    ""Carbohydrates"": 20.0,
    ""Sugars"": 0.0,
    ""Protein"": 12.0,
    ""DietaryFiber"": 0.0,
    ""Sodium"": 0.5
  },
  ""Label"": {
      ""helloworld"": {
          ""Value"": ""Haferflocken"",
          ""Tags"": [""Nices Zeug""]
      }
  },
  ""Servings"": {
    ""g"": 1.0
  },
  ""DefaultServing"": ""g"",
  ""Tags"": []
}", false);
        }

        [Fact]
        public void TestProductWithInvalidTag()
        {
            TestProduct(@"
{
  ""Code"": null,
  ""NutritionalInfo"": {
    ""Volume"": 100.0,
    ""Energy"": 244.0,
    ""Fat"": 0.0,
    ""SaturatedFat"": 0.0,
    ""Carbohydrates"": 20.0,
    ""Sugars"": 0.0,
    ""Protein"": 12.0,
    ""DietaryFiber"": 0.0,
    ""Sodium"": 0.5
  },
  ""Label"": {
      ""de"": {
          ""Value"": ""Haferflocken"",
          ""Tags"": [""Nices Zeug""]
      }
  },
  ""Servings"": {
    ""g"": 1.0
  },
  ""DefaultServing"": ""g"",
  ""Tags"": [""Hello World""]
}", false);
        }

        [Fact]
        public void TestProductWithNoServings()
        {
            TestProduct(@"
{
  ""Code"": null,
  ""NutritionalInfo"": {
    ""Volume"": 100.0,
    ""Energy"": 244.0,
    ""Fat"": 0.0,
    ""SaturatedFat"": 0.0,
    ""Carbohydrates"": 20.0,
    ""Sugars"": 0.0,
    ""Protein"": 12.0,
    ""DietaryFiber"": 0.0,
    ""Sodium"": 0.5
  },
  ""Label"": {
      ""de"": {
          ""Value"": ""Haferflocken"",
          ""Tags"": [""Nices Zeug""]
      }
  },
  ""Servings"": {},
  ""DefaultServing"": ""g"",
  ""Tags"": []
}", false);
        }

        [Fact]
        public void TestProductWithUnknownServing()
        {
            TestProduct(@"
{
  ""Code"": null,
  ""NutritionalInfo"": {
    ""Volume"": 100.0,
    ""Energy"": 244.0,
    ""Fat"": 0.0,
    ""SaturatedFat"": 0.0,
    ""Carbohydrates"": 20.0,
    ""Sugars"": 0.0,
    ""Protein"": 12.0,
    ""DietaryFiber"": 0.0,
    ""Sodium"": 0.5
  },
  ""Label"": {
      ""de"": {
          ""Value"": ""Haferflocken"",
          ""Tags"": [""Nices Zeug""]
      }
  },
  ""Servings"": {
    ""g"": 1.0,
    ""hello world"": 10.0
  },
  ""DefaultServing"": ""g"",
  ""Tags"": []
}", false);
        }

        [Fact]
        public void TestProductLiquidWithGramServing()
        {
            TestProduct(@"
{
  ""Code"": null,
  ""NutritionalInfo"": {
    ""Volume"": 100.0,
    ""Energy"": 244.0,
    ""Fat"": 0.0,
    ""SaturatedFat"": 0.0,
    ""Carbohydrates"": 20.0,
    ""Sugars"": 0.0,
    ""Protein"": 12.0,
    ""DietaryFiber"": 0.0,
    ""Sodium"": 0.5
  },
  ""Label"": {
      ""de"": {
          ""Value"": ""Haferflocken"",
          ""Tags"": [""Nices Zeug""]
      }
  },
  ""Servings"": {
    ""g"": 1.0,
    ""ml"": 1.0
  },
  ""DefaultServing"": ""g"",
  ""Tags"": [""liquid""]
}", false);
        }

        [Fact]
        public void TestProductWithDefaultServingThatIsNotSpecified()
        {
            TestProduct(@"
{
  ""Code"": null,
  ""NutritionalInfo"": {
    ""Volume"": 100.0,
    ""Energy"": 244.0,
    ""Fat"": 0.0,
    ""SaturatedFat"": 0.0,
    ""Carbohydrates"": 20.0,
    ""Sugars"": 0.0,
    ""Protein"": 12.0,
    ""DietaryFiber"": 0.0,
    ""Sodium"": 0.5
  },
  ""Label"": {
      ""de"": {
          ""Value"": ""Haferflocken"",
          ""Tags"": [""Nices Zeug""]
      }
  },
  ""Servings"": {
    ""g"": 1.0
  },
  ""DefaultServing"": ""slice"",
  ""Tags"": []
}", false);
        }

        [Fact]
        public void TestValidProductWithLiquid()
        {
            TestProduct(@"
{
  ""Code"": null,
  ""NutritionalInfo"": {
    ""Volume"": 100.0,
    ""Energy"": 244.0,
    ""Fat"": 0.0,
    ""SaturatedFat"": 0.0,
    ""Carbohydrates"": 20.0,
    ""Sugars"": 0.0,
    ""Protein"": 12.0,
    ""DietaryFiber"": 0.0,
    ""Sodium"": 0.5
  },
  ""Label"": {
      ""de"": {
          ""Value"": ""Haferflocken"",
          ""Tags"": [""Nices Zeug""]
      }
  },
  ""Servings"": {
    ""ml"": 1.0
  },
  ""DefaultServing"": ""ml"",
  ""Tags"": [""liquid""]
}", true);
        }

        private void TestProduct(string json, bool isValid)
        {
            var product = JsonConvert.DeserializeObject<ProductInfo>(json);
            var result = new ProductInfoValidator().Validate(product);
            Assert.Equal(isValid, result.IsValid);
        }
    }
}
