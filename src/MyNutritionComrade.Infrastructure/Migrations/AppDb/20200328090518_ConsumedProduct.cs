using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MyNutritionComrade.Infrastructure.Migrations.AppDb
{
    public partial class ConsumedProduct : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ConsumedProduct",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    Day = table.Column<DateTime>(nullable: false),
                    Time = table.Column<int>(nullable: false),
                    ProductId = table.Column<string>(nullable: false),
                    NutritionInformation_Mass = table.Column<double>(nullable: true),
                    NutritionInformation_Energy = table.Column<double>(nullable: true),
                    NutritionInformation_Fat = table.Column<double>(nullable: true),
                    NutritionInformation_SaturatedFat = table.Column<double>(nullable: true),
                    NutritionInformation_Carbohydrates = table.Column<double>(nullable: true),
                    NutritionInformation_Sugars = table.Column<double>(nullable: true),
                    NutritionInformation_Protein = table.Column<double>(nullable: true),
                    NutritionInformation_DietaryFiber = table.Column<double>(nullable: true),
                    NutritionInformation_Sodium = table.Column<double>(nullable: true),
                    Tags = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConsumedProduct", x => new { x.UserId, x.Day, x.Time, x.ProductId });
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConsumedProduct");
        }
    }
}
