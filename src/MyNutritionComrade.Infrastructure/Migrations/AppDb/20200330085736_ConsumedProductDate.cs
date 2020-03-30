using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MyNutritionComrade.Infrastructure.Migrations.AppDb
{
    public partial class ConsumedProductDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ConsumedProduct",
                table: "ConsumedProduct");

            migrationBuilder.DropColumn(
                name: "Day",
                table: "ConsumedProduct");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "ConsumedProduct",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_ConsumedProduct",
                table: "ConsumedProduct",
                columns: new[] { "UserId", "Date", "Time", "ProductId" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ConsumedProduct",
                table: "ConsumedProduct");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "ConsumedProduct");

            migrationBuilder.AddColumn<DateTime>(
                name: "Day",
                table: "ConsumedProduct",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_ConsumedProduct",
                table: "ConsumedProduct",
                columns: new[] { "UserId", "Day", "Time", "ProductId" });
        }
    }
}
