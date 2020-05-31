using System;
using System.Collections.Generic;
using System.Text;
using MyNutritionComrade.Core.Domain;

namespace MyNutritionComrade.IntegrationTests._Helpers
{
    public static class TestValues
    {
        // Haferflocken
        public static NutritionalInfo TestNutritionalInfo => new NutritionalInfo(100, 368, 7, 1.24, 58.7, 0.7, 13.5, 10.0, 0);
    }
}
