using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PureGym.Store.Data.Sql.Migrations
{
    public partial class addsubsets : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Subsets",
                columns: table => new
                {
                    SubsetId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subsets", x => x.SubsetId);
                });

            migrationBuilder.CreateTable(
                name: "SubsetItems",
                columns: table => new
                {
                    SubsetItemId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    SubsetId = table.Column<int>(nullable: false),
                    ItemId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubsetItems", x => x.SubsetItemId);
                    table.ForeignKey(
                        name: "FK_SubsetItems_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "ItemId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SubsetItems_Subsets_SubsetId",
                        column: x => x.SubsetId,
                        principalTable: "Subsets",
                        principalColumn: "SubsetId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SubsetItems_ItemId",
                table: "SubsetItems",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_SubsetItems_SubsetId",
                table: "SubsetItems",
                column: "SubsetId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SubsetItems");

            migrationBuilder.DropTable(
                name: "Subsets");
        }
    }
}
