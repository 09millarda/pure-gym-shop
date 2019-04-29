using Microsoft.EntityFrameworkCore.Migrations;

namespace PureGym.Store.Data.Sql.Migrations
{
    public partial class addimageuritoitems : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUri",
                table: "Items",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUri",
                table: "Items");
        }
    }
}
