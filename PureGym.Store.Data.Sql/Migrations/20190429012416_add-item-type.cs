using Microsoft.EntityFrameworkCore.Migrations;

namespace PureGym.Store.Data.Sql.Migrations
{
    public partial class additemtype : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ItemType",
                table: "Items",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ItemType",
                table: "Items");
        }
    }
}
