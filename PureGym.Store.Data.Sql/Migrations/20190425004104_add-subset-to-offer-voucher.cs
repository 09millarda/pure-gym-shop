using Microsoft.EntityFrameworkCore.Migrations;

namespace PureGym.Store.Data.Sql.Migrations
{
    public partial class addsubsettooffervoucher : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SubsetId",
                table: "OfferVouchers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_OfferVouchers_SubsetId",
                table: "OfferVouchers",
                column: "SubsetId");

            migrationBuilder.AddForeignKey(
                name: "FK_OfferVouchers_Subsets_SubsetId",
                table: "OfferVouchers",
                column: "SubsetId",
                principalTable: "Subsets",
                principalColumn: "SubsetId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OfferVouchers_Subsets_SubsetId",
                table: "OfferVouchers");

            migrationBuilder.DropIndex(
                name: "IX_OfferVouchers_SubsetId",
                table: "OfferVouchers");

            migrationBuilder.DropColumn(
                name: "SubsetId",
                table: "OfferVouchers");
        }
    }
}
