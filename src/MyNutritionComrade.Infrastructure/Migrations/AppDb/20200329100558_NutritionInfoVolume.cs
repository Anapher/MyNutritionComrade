using Microsoft.EntityFrameworkCore.Migrations;

namespace MyNutritionComrade.Infrastructure.Migrations.AppDb
{
    public partial class NutritionInfoVolume : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NutritionInformation_Mass",
                table: "ConsumedProduct");

            migrationBuilder.AddColumn<double>(
                name: "NutritionInformation_Volume",
                table: "ConsumedProduct",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NutritionInformation_Volume",
                table: "ConsumedProduct");

            migrationBuilder.AddColumn<double>(
                name: "NutritionInformation_Mass",
                table: "ConsumedProduct",
                type: "float",
                nullable: true);
        }
    }
}
