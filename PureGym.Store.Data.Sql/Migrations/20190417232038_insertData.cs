using Microsoft.EntityFrameworkCore.Migrations;

namespace PureGym.Store.Data.Sql.Migrations
{
    public partial class insertData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("INSERT INTO Items(Name, Description, Price, IsListed) Values('Test', 'test', 10.99, 1)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
