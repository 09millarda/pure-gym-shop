using Microsoft.EntityFrameworkCore.Migrations;

namespace PureGym.Store.Data.Sql.Migrations
{
    public partial class RemoveTest : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE Items");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
