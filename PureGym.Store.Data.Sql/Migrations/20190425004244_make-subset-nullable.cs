using Microsoft.EntityFrameworkCore.Migrations;

namespace PureGym.Store.Data.Sql.Migrations
{
    public partial class makesubsetnullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OfferVouchers_Subsets_SubsetId",
                table: "OfferVouchers");

            migrationBuilder.AlterColumn<int>(
                name: "SubsetId",
                table: "OfferVouchers",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_OfferVouchers_Subsets_SubsetId",
                table: "OfferVouchers",
                column: "SubsetId",
                principalTable: "Subsets",
                principalColumn: "SubsetId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OfferVouchers_Subsets_SubsetId",
                table: "OfferVouchers");

            migrationBuilder.AlterColumn<int>(
                name: "SubsetId",
                table: "OfferVouchers",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_OfferVouchers_Subsets_SubsetId",
                table: "OfferVouchers",
                column: "SubsetId",
                principalTable: "Subsets",
                principalColumn: "SubsetId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
