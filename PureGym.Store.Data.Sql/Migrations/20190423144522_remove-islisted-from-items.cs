using Microsoft.EntityFrameworkCore.Migrations;

namespace PureGym.Store.Data.Sql.Migrations
{
    public partial class removeislistedfromitems : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Value",
                table: "OfferVouchers");

            migrationBuilder.DropColumn(
                name: "IsListed",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Value",
                table: "GiftVouchers");

            migrationBuilder.AddColumn<decimal>(
                name: "Value",
                table: "Vouchers",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Value",
                table: "Vouchers");

            migrationBuilder.AddColumn<decimal>(
                name: "Value",
                table: "OfferVouchers",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "IsListed",
                table: "Items",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Value",
                table: "GiftVouchers",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
