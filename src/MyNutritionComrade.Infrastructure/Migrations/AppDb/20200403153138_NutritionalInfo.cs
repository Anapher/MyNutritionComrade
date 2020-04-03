using Microsoft.EntityFrameworkCore.Migrations;

namespace MyNutritionComrade.Infrastructure.Migrations.AppDb
{
    public partial class NutritionalInfo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NutritionInformation_Volume",
                table: "ConsumedProduct",
                newName: "NutritionalInfo_Volume");

            migrationBuilder.RenameColumn(
                name: "NutritionInformation_Sugars",
                table: "ConsumedProduct",
                newName: "NutritionalInfo_Sugars");

            migrationBuilder.RenameColumn(
                name: "NutritionInformation_Sodium",
                table: "ConsumedProduct",
                newName: "NutritionalInfo_Sodium");

            migrationBuilder.RenameColumn(
                name: "NutritionInformation_SaturatedFat",
                table: "ConsumedProduct",
                newName: "NutritionalInfo_SaturatedFat");

            migrationBuilder.RenameColumn(
                name: "NutritionInformation_Protein",
                table: "ConsumedProduct",
                newName: "NutritionalInfo_Protein");

            migrationBuilder.RenameColumn(
                name: "NutritionInformation_Fat",
                table: "ConsumedProduct",
                newName: "NutritionalInfo_Fat");

            migrationBuilder.RenameColumn(
                name: "NutritionInformation_Energy",
                table: "ConsumedProduct",
                newName: "NutritionalInfo_Energy");

            migrationBuilder.RenameColumn(
                name: "NutritionInformation_DietaryFiber",
                table: "ConsumedProduct",
                newName: "NutritionalInfo_DietaryFiber");

            migrationBuilder.RenameColumn(
                name: "NutritionInformation_Carbohydrates",
                table: "ConsumedProduct",
                newName: "NutritionalInfo_Carbohydrates");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NutritionalInfo_Volume",
                table: "ConsumedProduct",
                newName: "NutritionInformation_Volume");

            migrationBuilder.RenameColumn(
                name: "NutritionalInfo_Sugars",
                table: "ConsumedProduct",
                newName: "NutritionInformation_Sugars");

            migrationBuilder.RenameColumn(
                name: "NutritionalInfo_Sodium",
                table: "ConsumedProduct",
                newName: "NutritionInformation_Sodium");

            migrationBuilder.RenameColumn(
                name: "NutritionalInfo_SaturatedFat",
                table: "ConsumedProduct",
                newName: "NutritionInformation_SaturatedFat");

            migrationBuilder.RenameColumn(
                name: "NutritionalInfo_Protein",
                table: "ConsumedProduct",
                newName: "NutritionInformation_Protein");

            migrationBuilder.RenameColumn(
                name: "NutritionalInfo_Fat",
                table: "ConsumedProduct",
                newName: "NutritionInformation_Fat");

            migrationBuilder.RenameColumn(
                name: "NutritionalInfo_Energy",
                table: "ConsumedProduct",
                newName: "NutritionInformation_Energy");

            migrationBuilder.RenameColumn(
                name: "NutritionalInfo_DietaryFiber",
                table: "ConsumedProduct",
                newName: "NutritionInformation_DietaryFiber");

            migrationBuilder.RenameColumn(
                name: "NutritionalInfo_Carbohydrates",
                table: "ConsumedProduct",
                newName: "NutritionInformation_Carbohydrates");
        }
    }
}
